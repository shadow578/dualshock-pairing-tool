import { MACAddress } from "./MACAddress";
import { HIDDevice, HIDDeviceFilter } from "./webhid";

/**
 * Record of known devices supported by PairTool.
 */
const KNOWN_DEVICES: Record<string, HIDDeviceFilter> = {
    "Sony DualShock 4": { vendorId: 0x054c, productId: 0x05c4 },
};

export class PairTool {
    private device?: HIDDevice;

    public async open(deviceId?: HIDDeviceFilter): Promise<void> {
        // request HID access to any known device
        const filters = Object.values(KNOWN_DEVICES)
        if (deviceId) {
            filters.push(deviceId);
        }

        const [device] = await navigator.hid.requestDevice({ filters });
        if (!device) {
            throw new Error("No device found");
        }

        await device.open();

        this.device = device;
    }

    public async getPairedMac(): Promise<MACAddress> {
        const report = await this.device!.receiveFeatureReport(/* GET_MAC */ 0x12);

        // mac address is bytes 10-15 of the report, in reverse order
        const mac = new Uint8Array(report.buffer, 10, 6);
        return new MACAddress(mac.reverse());
    }

    public async setPairedMac(mac: MACAddress): Promise<void> {
        const data = new Uint8Array(22);

        // bytes 0-5 of the report are the mac address, in reverse order
        data.set(mac.bytes.reverse(), 0);

        // bytes 6-21 are something like a key, but are ok to be zeroed

        await this.device!.sendFeatureReport(0x13, data);
    }

    public static isSupported(): boolean {
        return "hid" in navigator;
    }
}