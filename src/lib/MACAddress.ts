export class MACAddress {
    constructor(private readonly _bytes: Uint8Array) { }

    public static fromString(mac: string): MACAddress {
        const parts = mac.split(":");
        if (parts.length !== 6) {
            throw new Error("Invalid MAC address");
        }

        // each part must be 1 or 2 characters long, and must contain only hex characters
        if (parts.some(part => !/^[0-9a-fA-F]{1,2}$/.test(part))) {
            throw new Error("Invalid MAC address");
        }

        const bytes = parts.map(part => parseInt(part, 16));
        return new MACAddress(new Uint8Array(bytes));
    }

    public toString(): string {
        return Array.from(this._bytes).map(byte => byte.toString(16).padStart(2, "0")).join(":");
    }

    public get bytes(): Uint8Array {
        return this._bytes;
    }
}