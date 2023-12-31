/* eslint-disable prettier/prettier */
/*
https://docs.nestjs.com/providers#services
*/

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountService } from 'src/account/services/account.service';
import { UserDto } from 'src/dto';
import { CompanyDto } from 'src/dto/company.dto';
import { UserRole } from 'src/enum/user-roles.enum';
import { Company } from 'src/models';
import { TokenGeneratorService } from '../notification/services/token_generator.service';

@Injectable()
export class CompanyService {

    constructor(
        private accountService: AccountService,
        private tokenGeneratorService: TokenGeneratorService,
        @InjectModel(Company.name) private readonly companyModel: Model<CompanyDto>,

    ) { }

    async createCompany(companyDto: CompanyDto) {
        const found = await this.companyModel.findOne({ email: companyDto.email });

        if (found) throw new ConflictException('company email already exist');

        const foundUser = await this.accountService.findUserByEmail(companyDto.email);
        if (foundUser) {
            companyDto.createdBy = foundUser.id;
            const res = await this.accountService.signIn({ email: companyDto.email, password: companyDto.password });
            const saved = await this.companyModel.create(companyDto);
            return { ...res, company: saved.toJSON() };
        } else {
            const token = this.tokenGeneratorService.genToken();
            const result = await this.accountService.signUp({
                firstName: companyDto.companyName, lastName: companyDto.companyName,
                email: companyDto.email, roles: [UserRole.COMPANY_ADMIN], password: companyDto.password, name: companyDto.companyName, emailVerificationToken: token
            });
            companyDto.createdBy = result.user['id']?.toString() ?? result.user['_id']?.toString();
            const saved = await this.companyModel.create(companyDto);
            return { ...result, company: saved.toJSON() };
        }


    } async getMyCompany(user: UserDto) {
        return await this.companyModel.find({ createdBy: user.id });
    }
}
