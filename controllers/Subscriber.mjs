import User from "../models/users.mjs"
import Transaction from '../models/transactions.mjs'
import { createTransport } from 'nodemailer'

export const sendEmail = (email, subject, receiver, template) => {
    const transporter = createTransport({
        service: process.env.SERVICE,
        auth: {
            user: process.env.ADDRESS,
            pass: process.env.PASS
        }
    })

    let mailOptions = {
        from: email,
        to: receiver,
        subject,
        html: template
    };
    transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
            return {error: 'sorry... Error occured when processing, try again'}
        }
    });
    return null
}

export const Subscriber = async (req, res) => {
    let data = req.body
    const user = req.user

    if (!data.statuserror) {
        if (!data.reference || !data.status || !data.message || !data.transaction || !data.trxref || !data.email) {
            return res.sendStatus(400)
        }
    } else {
        data.reference = 'xxxxxxxxxxxxxxx'
        data.status = 'failed'
        data.message = 'xxxxxxxxxxxxxxxxx'
        data.transaction = 'xxxxxxxxxxxxxxxxxx'
        data.trxref = 'xxxxxxxxxxxxxxxxx'
    }
    try {
        const findAdmins = await User.find({})
        const isThereAdmin = findAdmins.filter((other) => other.isAdmin === true)

        const transaction = new Transaction(data)

        transaction.save()

        const template = `
        <h1>Web Customization Paid Request</h1>
        <p>you are given a task to create a website on the ${new Date()}</p>
        <p>the email of the person is</p>
        <h1>${email}</h1>
        `

        const returedValue = sendEmail(data.email, 'Web Customization Request', process.env.ADDRESS, template)
        if (returedValue) {
            return res.status(500).send(returedValue)
        }
        if (isThereAdmin) {
            return res.status(200).send({ message: "Payment received. We'll get back to you within 24 hours" })
        }
    
        const becomeAdmin = await User.findByID(user)
        becomeAdmin.isAdmin = true
        becomeAdmin.save()

        return res.status(200).send({ message: "you own the site now!, relogin to get access" })
    } catch (error) {
        return res.status(500).send({ error: "Please contact us for help"})
    }
}
