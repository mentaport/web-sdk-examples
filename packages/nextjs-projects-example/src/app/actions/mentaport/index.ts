'use server'
import { _getMentaportSDK } from "./mentaport-sdk"
import { ICertificateProject, ICreateCertProject, IUpdateCertProject, IUpdateCertProjectStatus, ContractStatus, IResults } from '@mentaport/certificates-projects';

export const createNewProject = async (
    newProject: ICreateCertProject
): Promise<IResults<ICertificateProject>> => {
    const sdk = await _getMentaportSDK();
    return sdk.createNewCertificateProject(newProject);
}

export const activateCertificateProject = async (
    contractId: string,
    projectId: string,
) => {
    const sdk = await _getMentaportSDK();
    return await sdk.activateProject(
        contractId,
        projectId
    );
}

export const getContracts = async (includeInactiveProjects: boolean) => {
    const sdk = await _getMentaportSDK();
    return await sdk.getContracts(includeInactiveProjects);
}

export const getCertificateProjects = async (
    contractId?: string,
    customerId?: string
) => {

    const sdk = await _getMentaportSDK();
    return await sdk.getProjects(contractId, customerId);
}

export const getCertificateProjectById = async (
    contractId:string,
    projectId: string,
) => {
    const sdk = await _getMentaportSDK();
    return await sdk.getProjectById(contractId, projectId);
}

export const updateProject = async (updateProject: IUpdateCertProject) => {

    const sdk = await _getMentaportSDK();
    return await sdk.updateProjectById(updateProject);
}

export const updateProjectStatus = async (updateProject: IUpdateCertProjectStatus) => {
    const sdk = await _getMentaportSDK();
    return await sdk.updateProjectStatusById(updateProject);
}

export const pauseProject = async (contractId: string, projectId: string) => {
    const sdk = await _getMentaportSDK();
    return await sdk.updateProjectStatusById(
        {
            contractId,
            projectId,
            status: ContractStatus.Paused,
        });
}

export const resumeProject = async (contractId: string, projectId: string) => {
    const sdk = await _getMentaportSDK();
    return await sdk.updateProjectStatusById(
        {
            contractId,
            projectId,
            status: ContractStatus.Active,
        });
}