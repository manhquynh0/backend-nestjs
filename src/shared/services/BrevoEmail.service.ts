import { Injectable } from "@nestjs/common"
import { Brevo, BrevoClient } from '@getbrevo/brevo'
import envConfig from "~/shared/config.js"
@Injectable()
export class BrevoEmailService {
    private readonly brevoClient: BrevoClient
    constructor() {
        this.brevoClient = new BrevoClient({
            apiKey: envConfig.BREVO_API_KEY
        })

    }
    async sendEmail(payload: { email: string, subject: string, html: string }): Promise<Brevo.SendTransacEmailResponse> {
        try {
            const { email, subject, html } = payload
            const response = await this.brevoClient.transactionalEmails.sendTransacEmail({
                "sender": {
                    "name": `SHOPPE CLONE - ${subject}`,
                    "email": `${envConfig.ADMIN_EMAIL}`
                },
                "to": [
                    {
                        "email": email,
                        "name": subject
                    }
                ],
                "subject": subject,
                "htmlContent": html
            })
            return response
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(error?.message || 'Lỗi khi gửi email qua Brevo')
            } else {
                throw new Error('Lỗi khi gửi email qua Brevo')
            }
        }
    }
}