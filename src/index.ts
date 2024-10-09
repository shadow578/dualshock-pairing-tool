import { PairTool } from "./lib/PairTool";
import { MACAddress } from "./lib/MACAddress";

window.onload = () => {
    // get page element references
    const page = {
        notSupportedContainer: document.getElementById("not_supported_container")!,
        connectContainer: document.getElementById("connect_container")!,
        pairContainer: document.getElementById("pair_container")!,
        connectButton: document.getElementById("connect_button")! as HTMLButtonElement,
        getPairedButton: document.getElementById("get_paired_button")! as HTMLButtonElement,
        setPairedButton: document.getElementById("set_paired_button")! as HTMLButtonElement,
        macTextInput: document.getElementById("mac_input")! as HTMLInputElement,
        snackbar: document.getElementById("snackbar")!,
    }

    // ensure all elements were found
    for (const key in page) {
        if (page[key] === null) {
            throw new Error(`Page Element "${key}" is missing`);
        }
    }

    function showSnackbar(message: string, timeout = 3000) {
        page.snackbar.textContent = message;
        page.snackbar.classList.add("show");
        setTimeout(() => page.snackbar.classList.remove("show"), timeout);
    }

    function setButtons(isConnected: boolean) {
        page.connectButton.disabled = isConnected;
        page.getPairedButton.disabled = !isConnected;
        page.setPairedButton.disabled = !isConnected;
        page.macTextInput.disabled = !isConnected;

        //page.connectContainer.style.display = isConnected ? "none" : "block";
        page.pairContainer.style.display = isConnected ? "block" : "none";
    }

    // check if WebHID is supported, and show the appropriate UI
    if (PairTool.isSupported()) {
        page.notSupportedContainer.style.display = "none";
        page.connectContainer.style.display = "block";
    }

    // ensure buttons are in valid state when the page loads
    setButtons(false);

    // create PairTool instance
    const pairTool = new PairTool();

    // wire up buttons
    page.connectButton.onclick = async () => {
        try {
            // disable connect button while connect is pending
            setButtons(false);
            page.connectButton.disabled = true;

            // connect to the controller
            await pairTool.open();

            // everything is good, update buttons
            setButtons(true);

            // automatically fetch current MAC address unless the text input field is already filled
            if (page.macTextInput.value === "") {
                page.getPairedButton.click();
            }

            // show success message
            showSnackbar("Connected to controller");
        } catch (error) {
            setButtons(false);
            showSnackbar(error.message);
        }
    };

    page.getPairedButton.onclick = async () => {
        try {
            // disable buttons while getPairedMac is pending
            page.getPairedButton.disabled = true;
            page.setPairedButton.disabled = true;

            // get the current MAC address
            const mac = await pairTool.getPairedMac();

            // update the text input field
            page.macTextInput.value = mac.toString();

            // show success message
            showSnackbar("MAC address fetched successfully");
        } catch (error) {
            showSnackbar(error.message);
        }

        page.getPairedButton.disabled = false;
        page.setPairedButton.disabled = false;
    };

    page.setPairedButton.onclick = async () => {
        let mac;
        try {
            // parse mac address from text input field
            mac = MACAddress.fromString(page.macTextInput.value);

            // write-back the parsed MAC address to the text input field
            // so the user knows everything was parsed as expected
            page.macTextInput.value = mac.toString();
        } catch (error) {
            showSnackbar(error.message);
            return;
        }

        try {
            // pair the controller with the new MAC address
            await pairTool.setPairedMac(mac);

            // show success message
            showSnackbar("MAC address set successfully");
        } catch (error) {
            showSnackbar(error.message);
        }
    };

    // allow passing MAC address as a query parameter
    // ?mac=XX:XX:XX:XX:XX:XX
    const urlParams = new URLSearchParams(window.location.search);
    const macParam = urlParams.get("mac");
    if (macParam) {
        // parse MAC address from query parameter before setting it
        // to make sure it's valid and to avoid xss attacks
        const mac = MACAddress.fromString(macParam);
        page.macTextInput.value = mac.toString();
    }
}
