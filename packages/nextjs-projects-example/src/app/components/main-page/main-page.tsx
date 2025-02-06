import React from "react";
import Tabs from "../tabs/tabs";
import { Box } from "@chakra-ui/react";
import "./main-page.scss";
import ExampleSection from "../example-section/example-section";

export enum SDKExample {
    create = "create",
    get = "get",
    getContracts = "getContracts",
    activate = "activate",
    updateInfo = "updateInfo",
    updateStatus = "updateStatus",
}

const MainPage: React.FC = () => {
    const [currentSDKExample, setCurrentSDKExample] = React.useState<SDKExample>(SDKExample.create);

    return (
        <div className="MainPage">
            <Box className="MainContent">
            <Tabs currentSDKExample={currentSDKExample} onSelectSDKExample={setCurrentSDKExample} />
                <ExampleSection type={currentSDKExample} />
                <Box className="Footer">
                    <Box className="FooterContent">
                        © 2024 Mentaport Inc. All rights reserved.
                    </Box>
                </Box>
            </Box>
        </div>
    )
};

export default MainPage;