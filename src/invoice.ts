import { InvoiceBody } from './invoice.types'

const PizZip = require('pizzip')
const { DateTime } = require('luxon')
const path = require('path')
const fs = require('fs')
const Docxtemplater = require('docxtemplater')

const TEMPLATE_FILE_NAME = 'template.docx'
const TEMPLATE_FILE_PATH = path.join(__dirname, '..', TEMPLATE_FILE_NAME)

const currentDate = DateTime.local()

const getDueDate = () => {
  let fifthBusinessDayNextMonth = currentDate
    .plus({ month: 1 })
    .startOf('month')

  let businessDaysCount = 0

  while (businessDaysCount < 5) {
    if (fifthBusinessDayNextMonth.weekday <= 5) {
      businessDaysCount++
    }
    fifthBusinessDayNextMonth = fifthBusinessDayNextMonth.plus({ days: 1 })
  }

  return fifthBusinessDayNextMonth.toFormat('MM/dd/yyyy')
}

const generateInvoice = async (data: InvoiceBody) => {
  // Loads the content from invoice template
  const templateContent = fs.readFileSync(TEMPLATE_FILE_PATH, 'binary')

  const zip = new PizZip(templateContent)

  const template = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  })

  const date = currentDate.toFormat('MM/dd/yyyy')
  const dueDate = getDueDate()

  template.render({ ...data, date, dueDate })

  return template.getZip().generate({ type: 'nodebuffer' })
}

export { generateInvoice }
