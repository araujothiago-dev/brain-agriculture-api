import { cnpj, cpf } from 'cpf-cnpj-validator';

export class CpfCnpjVerify {
    async cpfCnpjVerify(cpfCnpj: string) {

        if (!cpf.isValid(cpfCnpj) && !cnpj.isValid(cpfCnpj)) {
            return false;
        }
        
        return true;
    }
}