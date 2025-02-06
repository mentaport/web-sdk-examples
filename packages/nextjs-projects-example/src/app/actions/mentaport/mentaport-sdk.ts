'use server';
import { CertificateProjectsSDK, Environment } from "@mentaport/certificates-projects";

let _mentaportSDK: CertificateProjectsSDK | null = null;

export async function _getMentaportSDK(): Promise<CertificateProjectsSDK> {
    if (_mentaportSDK != null) {
        return _mentaportSDK;
    }

    return await _initMentaportSdk();
}

async function _initMentaportSdk() {
    console.log('Initializing Mentaport SDK', process.env.NEXT_MENTAPORT_API_KEY);
    _mentaportSDK = new CertificateProjectsSDK(process.env.NEXT_MENTAPORT_API_KEY!);
    if (!_mentaportSDK) {
        throw new Error(
            'It is not possible to create a CertificateProjectsSDK due to an initialization problem.'
        );
    }

    _mentaportSDK.setClientEnv(Environment.DEVELOPMENT);
    return _mentaportSDK;
}
