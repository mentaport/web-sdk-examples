import React, { useCallback } from "react";
import { SDKExample } from "../main-page/main-page";
import "./tabs.scss";
import { Box } from "@chakra-ui/react";

export interface SideDrawerProps {
    currentSDKExample: SDKExample;
    onSelectSDKExample: (sdkExample: SDKExample) => void;
}

const Tabs: React.FC<SideDrawerProps> = ({ currentSDKExample, onSelectSDKExample }) => {
    const onClick = useCallback((sdkExample: SDKExample) => {
        onSelectSDKExample(sdkExample);
    }, [onSelectSDKExample]);

    const mapSdkEnumToDisplayText = (sdkExample: SDKExample) => {
        switch (sdkExample) {
            case SDKExample.create:
                return "Create a New Project";
            case SDKExample.get:
                return "Get Projects";
            case SDKExample.getContracts:
                return "Get Contracts";
            case SDKExample.activate:
                return "Activate Project";
            case SDKExample.updateInfo:
                return "Update Project Info";
            case SDKExample.updateStatus:
                return "Update Project Status";
        }
    }
    return (
        <Box className="Tabs">
            <Box className="TabsContainer">
                {Object.values(SDKExample).map((sdkExample) => (
                    <Box
                        key={sdkExample}
                        className={`Tab ${currentSDKExample === sdkExample ? "Active" : ""}`}
                        onClick={() => onClick(sdkExample)}
                    >
                        {mapSdkEnumToDisplayText(sdkExample)}
                    </Box>
                ))
                }
            </Box>
        </Box>
    )
}

export default Tabs;