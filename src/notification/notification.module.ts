import { NotificationController } from './controllers/notification.controller';
import { NotificationService } from './services/notification.service';
/* eslint-disable prettier/prettier */
/*
https://docs.nestjs.com/modules
*/

import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { join } from 'path';


@Module({
    imports: [MailerModule.forRoot({
        transport: 'smtps://account@easylabsltd.com:Njs123456@,@mail.easylabsltd.com',
        defaults: {
            from: '"Account" <account@easylabsltd.com>',
        },
        template: {
            dir: __dirname + '/templates',
            adapter: new HandlebarsAdapter(),
            options: {
                strict: true,
            },
        },
        options: {
            partials: {
                dir: join(process.env.PWD, 'templates/partials'),
                options: {
                    strict: true,
                },
            },
        }
    }),],
    controllers: [
        NotificationController,],
    providers: [
        NotificationService,],
    exports: [NotificationService]
})
export class NotificationModule { }
// Njs123456@,
// RlZ@Bp(Tv^yX