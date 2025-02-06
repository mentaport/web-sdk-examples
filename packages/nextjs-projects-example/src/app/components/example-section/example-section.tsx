import React, { useCallback, useEffect, useMemo } from "react";
import { SDKExample } from "../main-page/main-page";
import { Box, Input, Select, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import "./example-section.scss";
import { ContractStatus, IResults } from "@mentaport/certificates-projects";
import {
  activateCertificateProject,
  createNewProject,
  getCertificateProjectById,
  getCertificateProjects,
  getContracts,
  updateProject,
  updateProjectStatus,
} from "@/app/actions/mentaport";

export interface ExampleSectionProps {
  type: SDKExample;
}
const ExampleSection: React.FC<ExampleSectionProps> = ({ type }) => {
  const [contractId, setContractId] = React.useState<string>("");
  const [projectId, setProjectId] = React.useState<string>("");
  const [customerId, setCustomerId] = React.useState<string>("");
  const [ownerName, setOwnerName] = React.useState<string>("");
  const [projectName, setProjectName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [ownerWallet, setOwnerWallet] = React.useState<string>("");
  const [projectBaseURI, setProjectBaseURI] = React.useState<string>("");
  const [fetchInactiveContracts, setFetchInactiveContracts] =
    React.useState<boolean>();
  const [status, setStatus] = React.useState<ContractStatus>();

  const [results, setResults] = React.useState<IResults<any>>();
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    resetForm();
    setResults(undefined);
  }, [type]);

  const resetForm = useCallback(() => {
    setContractId("");
    setProjectId("");
    setCustomerId("");
    setOwnerName("");
    setProjectName("");
    setEmail("");
    setOwnerWallet("");
    setProjectBaseURI("");
    setStatus(undefined);
  }, []);

  const onSubmitClick = useCallback(async () => {
    if (submitting) {
      return;
    }

    let error = "";
    switch (type) {
      case SDKExample.create:
        if (!contractId || !projectName || !ownerName) {
          error =
            "Please include a contract ID, project name, owner name, and owner wallet.";
        }
        if (!email && !ownerWallet) {
          error = "Please include either an email or owner wallet.";
        }
        break;
      case SDKExample.getContracts:
        break;
      case SDKExample.get:
        if (!contractId) {
          error = "Please include a contract ID.";
        }
        break;
      case SDKExample.activate:
        if (!contractId || !projectId) {
          error = "Please include a contract ID and project ID.";
        }
        break;
      case SDKExample.updateInfo:
        if (!contractId || !projectId) {
          error = "Please include a contract ID and project ID.";
        }
        break;
      case SDKExample.updateStatus:
        if (!contractId || !projectId || !status) {
          error = "Please include a contract ID, project ID, and new status.";
        }
        break;
    }

    if (error) {
      setError(error);
      return;
    }

    setSubmitting(true);
    try {
      switch (type) {
        case SDKExample.create:
          const res = await createNewProject({
            contractId: contractId!,
            projectName,
            ownerName: ownerName,
            email,
            ownerWallet,
            projectBaseURI,
            customerId,
          });
          if (!res.status) {
            console.error("error", JSON.stringify(res));
            throw new Error(res.message);
          }

          setResults(res);
          break;
        case SDKExample.get:
          // Call get projects function
          let getRes;
          if (!projectId) {
            getRes = await getCertificateProjects(contractId, customerId);
          } else {
            getRes = await getCertificateProjectById(contractId, projectId);
          }
          if (!getRes.status) {
            console.error("error", getRes);
            throw new Error(getRes.message);
          }
          setResults(getRes);
          break;
        case SDKExample.getContracts:
          const contractsRes = await getContracts(!!fetchInactiveContracts);
          if (!contractsRes.status) {
            console.error("error", contractsRes);
            throw new Error(contractsRes.message);
          }
          setResults(contractsRes);
          break;
        case SDKExample.activate:
          // Call activate project function
          const activationRes = await activateCertificateProject(
            contractId!,
            projectId!
          );
          if (!activationRes.status) {
            console.error("error", activationRes);
            throw new Error(activationRes.message);
          }
          setResults(activationRes);
          break;
        case SDKExample.updateInfo:
          // Call update project info function
          const updateRes = await updateProject({
            contractId: contractId!,
            projectId: projectId!,
            ownerName: ownerName,
            ownerWallet,
            projectBaseURI,
          });
          if (!updateRes.status) {
            console.error("error", JSON.stringify(updateRes.message));
            throw new Error(updateRes.message);
          }
          setResults(updateRes);
          break;
        case SDKExample.updateStatus:
          // Call update project status function
          const updateStatusRes = await updateProjectStatus({
            contractId: contractId!,
            projectId: projectId!,
            status: status!,
          });
          if (!updateStatusRes.status) {
            throw new Error(updateStatusRes.message);
          }
          setResults(updateStatusRes);
          break;
      }
      resetForm();
    } catch (e: any) {
      setResults(e.message);
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }, [
    type,
    contractId,
    projectId,
    customerId,
    ownerName,
    projectName,
    email,
    ownerWallet,
    projectBaseURI,
    status,
    submitting,
    fetchInactiveContracts,
    setSubmitting,
    setResults,
    setError,
  ]);

  const onChangeFetchInactiveContracts = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value.trim();
      setFetchInactiveContracts(value === "true");
    },
    [setFetchInactiveContracts]
  );

  const title = useMemo(() => {
    switch (type) {
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
  }, [type]);

  const description = useMemo(() => {
    switch (type) {
      case SDKExample.create:
        return "Create a new project using the certificate admin account. The project will be added to the blockchain which can then be activated.";
      case SDKExample.get:
        return "Get all projects created by the certificate admin.";
      case SDKExample.getContracts:
        return "Get all contracts created and used by the admin account.";
      case SDKExample.activate:
        return "After creating a new project, you need to activate it for certificates to be minted.";
      case SDKExample.updateInfo:
        return "You can update the project's owner name, wallet address, etc. Note that any pre-existing certificates will not be affected by this change.";
      case SDKExample.updateStatus:
        return "You have the ability to pause or resume the project. When paused, no new certificates can be minted.";
    }
  }, [type]);

  const codeSnippet = useMemo(() => {
    switch (type) {
      case SDKExample.create:
        return `const project = await mentaport.createNewCertificateProject({
                    contractId: "0x123",
                    projectName: "MyProject",
                    ownerName: "Alice",
                    email: undefined,
                    ownerWallet: "0x456",
                    projectBaseURI?: "https://myproject.com",
                    customerId?: ""
                });`;
      case SDKExample.get:
        return `const projects = await mentaport.getProjects(contractId); // get all projects of contract;\n// or\nconst project = await mentaport.getProjectById(contractId, projectId); // get project by project id
                        `;
      case SDKExample.getContracts:
        return `const contracts = await mentaport.getContracts(true);`;
      case SDKExample.activate:
        return `const activationRes = await mentaportSdk.activateProject(contractId, projectId);`;
      case SDKExample.updateInfo:
        return `const updateProject = await mentaport.updateProjectById({
                            contractId: "0x123",
                            projectId: "0x456",
                            ownerName: "Bob", // new owner name
                            ownerWallet: "0x789", // new owner wallet
                            projectBaseURI: "https://mynewproject.com", // new project base URI
                        });`;
      case SDKExample.updateStatus:
        return `const updateProjectStatus = await mentaport.updateProjectStatusById({
                            contractId: "0x123",
                            projectId: "0x456",
                            status: ContractStatus.Paused, // pause the project
                        });`;
    }
  }, [type]);

  const inputSection = useMemo(() => {
    switch (type) {
      case SDKExample.create:
        return (
          <SimpleGrid columns={2} spacing={4} w={"100%"}>
            <Input
              className="Input"
              placeholder="Contract ID"
              value={contractId}
              onChange={(e) => setContractId(e.target.value)}
            />
            <Input
              className="Input"
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <Input
              className="Input"
              placeholder="Owner Name"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
            />
            <Input
              className="Input"
              placeholder="Email (optional is wallet address provided)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              className="Input"
              placeholder="Owner Wallet (optional if email provided)"
              value={ownerWallet}
              onChange={(e) => setOwnerWallet(e.target.value)}
            />
            <Input
              className="Input"
              placeholder="Project Base URI (optional)"
              value={projectBaseURI}
              onChange={(e) => setProjectBaseURI(e.target.value)}
            />
            <Input
              className="Input"
              placeholder="Customer ID (optional)"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            />
          </SimpleGrid>
        );
      case SDKExample.get:
        return (
          <SimpleGrid columns={2} spacing={4} w={"100%"}>
            <Input
              className="Input"
              placeholder="Contract ID "
              value={contractId}
              onChange={(e) => setContractId(e.target.value)}
            />
            <Input
              className="Input"
              placeholder="Customer ID (optional)"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            />
            <Input
              className="Input"
              placeholder="Project ID (optional)"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            />
          </SimpleGrid>
        );
      case SDKExample.getContracts:
        return (
          <SimpleGrid columns={1} spacing={4} w={"100%"}>
            <Select
              className="Input"
              placeholder="Include Inactive Contracts"
              value={
                fetchInactiveContracts === undefined
                  ? undefined
                  : fetchInactiveContracts
                  ? "true"
                  : "false"
              }
              onChange={onChangeFetchInactiveContracts}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </Select>
          </SimpleGrid>
        );
      case SDKExample.activate:
        return (
          <SimpleGrid columns={2} spacing={4} w={"100%"}>
            <Input
              className="Input"
              placeholder="Contract ID"
              value={contractId}
              onChange={(e) => setContractId(e.target.value)}
            />
            <Input
              className="Input"
              placeholder="Project ID"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            />
          </SimpleGrid>
        );
      case SDKExample.updateInfo:
        return (
          <SimpleGrid columns={2} spacing={4} w={"100%"}>
            <Input
              className="Input"
              placeholder="Contract ID"
              value={contractId}
              onChange={(e) => setContractId(e.target.value)}
            />
            <Input
              className="Input"
              placeholder="Project ID"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            />
            <Input
              className="Input"
              placeholder="Owner Name (optional)"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
            />
            <Input
              className="Input"
              placeholder="Owner Wallet (optional)"
              value={ownerWallet}
              onChange={(e) => setOwnerWallet(e.target.value)}
            />
            <Input
              className="Input"
              placeholder="Project Base URI (optional)"
              value={projectBaseURI}
              onChange={(e) => setProjectBaseURI(e.target.value)}
            />
          </SimpleGrid>
        );
      case SDKExample.updateStatus:
        return (
          <SimpleGrid columns={2} spacing={4} w={"100%"}>
            <Input
              className="Input"
              placeholder="Contract ID"
              value={contractId}
              onChange={(e) => setContractId(e.target.value)}
            />
            <Input
              className="Input"
              placeholder="Project ID"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            />
            <Select
              className="Input"
              placeholder="Select a New Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as ContractStatus)}
            >
              <option value={ContractStatus.Active}>Active</option>
              <option value={ContractStatus.Paused}>Paused</option>
            </Select>
          </SimpleGrid>
        );
    }
  }, [
    type,
    contractId,
    projectId,
    customerId,
    ownerName,
    projectName,
    email,
    ownerWallet,
    projectBaseURI,
    status,
    fetchInactiveContracts,
  ]);

  return (
    <Stack w={"100%"} alignItems={"center"}>
      <Box className="ExampleSection">
        <Box className="Title">{title}</Box>
        <Box className="Description">{description}</Box>
        <Box className="CodeSnippet">
          <Text whiteSpace={"pre-wrap"} fontFamily={"monospace"}>
            {codeSnippet}
          </Text>
        </Box>
        <Box className="Description">Try it yourself:</Box>
        {inputSection}
        <Box
          className={`SubmitButton ${submitting ? "Disabled" : ""}`}
          onClick={onSubmitClick}
        >
          {submitting ? "Processing..." : "Submit"}
        </Box>
        {error && <Box className="Error">{error}</Box>}
      </Box>
      <Box className="ExampleSection">
        <Box className="Description">Results:</Box>
        <Box className="CodeSnippet">
          <Text whiteSpace={"pre-wrap"} fontFamily={"monospace"}>
            {results ? JSON.stringify(results, null, 2) : ""}
          </Text>
        </Box>
      </Box>
    </Stack>
  );
};

export default ExampleSection;
