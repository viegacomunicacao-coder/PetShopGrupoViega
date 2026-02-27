import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportElementToPDF(elementId: string, filename = "relatorio.pdf") {
  const el = document.getElementById(elementId);
  if (!el) {
    throw new Error(`Elemento com id "${elementId}" não encontrado.`);
  }

  const canvas = await html2canvas(el, { scale: 2, backgroundColor: "#ffffff" });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let position = 0;
  let remainingHeight = imgHeight;

  while (remainingHeight > 0) {
    pdf.addImage(imgData, "PNG", 0, position === 0 ? 0 : 20, imgWidth, imgHeight);
    remainingHeight -= pageHeight;
    if (remainingHeight > 0) {
      pdf.addPage();
      position = 0;
    }
  }

  pdf.save(filename);
}