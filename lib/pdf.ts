export async function downloadAsPdf(elementId: string, filename: string): Promise<void> {
  const { jsPDF } = await import("jspdf")
  const html2canvas = (await import("html2canvas")).default

  const element = document.getElementById(elementId)
  if (!element) return

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  })

  const imgData = canvas.toDataURL("image/png")
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 10
  const imgWidth = pageWidth - margin * 2
  const imgHeight = (canvas.height * imgWidth) / canvas.width
  const contentHeight = pageHeight - margin * 2
  const pageCount = Math.ceil(imgHeight / contentHeight)

  for (let i = 0; i < pageCount; i++) {
    if (i > 0) pdf.addPage()
    pdf.addImage(imgData, "PNG", margin, margin - i * contentHeight, imgWidth, imgHeight)
  }

  pdf.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`)
}
