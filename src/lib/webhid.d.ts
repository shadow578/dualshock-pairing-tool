// partial (!!) types for WebHID api, based on https://developer.mozilla.org/en-US/docs/Web/API/HID

export interface HID {
    getDevices(): Promise<HIDDevice[]>;
    requestDevice(options: HIDRequestDeviceOptions): Promise<HIDDevice[]>;
}

export interface HIDRequestDeviceOptions {
    filters?: HIDDeviceFilter[];
}

export interface HIDDeviceFilter {
    vendorId?: number;
    productId?: number;
    usagePage?: number;
    usage?: number;
}

export interface HIDDevice {
    readonly opened: boolean;
    readonly vendorId: number;
    readonly productId: number;
    readonly productName: string;

    open(): Promise<void>;
    close(): Promise<void>;
    forget(): Promise<void>;
    sendReport(reportId: number, data: ArrayBuffer | Uint8Array | DataView): Promise<void>;
    sendFeatureReport(reportId: number, data: ArrayBuffer | Uint8Array | DataView): Promise<void>;
    receiveFeatureReport(reportId: number): Promise<DataView>;
}

declare global {
    interface Navigator {
        hid: HID;
    }
}

export { }