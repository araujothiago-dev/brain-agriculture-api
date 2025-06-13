import { cnpj, cpf } from 'cpf-cnpj-validator';

export class CpfCnpjVerify {
    async cpfCnpjVerify(cpfCnpj: string) {
        
        cpfCnpj = cpfCnpj.replace(/[^0-9]/g, "").trim();

        if (!cpf.isValid(cpfCnpj) && !cnpj.isValid(cpfCnpj)) {
            return false;
        }
        
        return true;
    }
}