import { Component, OnInit } from '@angular/core';
import { BillingReportService } from './allbills.service';
import { BillingReport } from '../../../interfaces/billing-report';
import { CommonModule } from '@angular/common';

declare var html2pdf: any;

@Component({
  selector: 'app-all-bills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-bills.component.html',
  styleUrl: './all-bills.component.css',
})
export class AllBillsComponent implements OnInit {
  billingReports: BillingReport[] = [];
  selectedReport: BillingReport | null = null;
  isGeneratingPdf = false; // Add loading state
  currentDatenow: any = Date.now;

  reservationStatusMap: Record<number, string> = {
    0: 'Pending',
    1: 'Checked In',
    2: 'Checked Out',
    3: 'Cancelled',
    4: 'Completed',
  };

  paymentMethodMap: Record<number, string> = {
    1: 'Cash',
    2: 'Card',
    3: 'Online',
  };

  paymentStatusMap: Record<number, string> = {
    0: 'Pending',
    1: 'Paid',
    2: 'Failed',
  };

  constructor(private billingReportService: BillingReportService) {}

  ngOnInit(): void {
    this.billingReportService.getBillingReport().subscribe({
      next: (data) => {
        this.billingReports = data;
      },
      error: (err) => {
        console.error('Failed to load billing reports', err);
      },
    });
  }

  openReport(report: BillingReport): void {
    this.selectedReport = report;
  }

  closeReport(): void {
    this.selectedReport = null;
  }

  // Working PDF generation method
  async printAsPdf(): Promise<void> {
    if (!this.selectedReport) {
      console.error('No report selected');
      return;
    }

    // Check if html2pdf is available
    if (typeof html2pdf === 'undefined') {
      console.error(
        'html2pdf is not loaded. Please add the CDN script to index.html'
      );
      alert('PDF generation is not available. Please contact support.');
      return;
    }

    this.isGeneratingPdf = true;

    try {
      // Get the content element
      const element = document.getElementById('print-section');
      if (!element) {
        throw new Error('Print section not found');
      }

      // Configure PDF options
      const options = {
        margin: 0.5,
        filename: `billing-report-${this.selectedReport.customerName.replace(
          /[^a-zA-Z0-9]/g,
          '-'
        )}.pdf`,
        image: {
          type: 'jpeg',
          quality: 0.98,
        },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
        },
        jsPDF: {
          unit: 'in',
          format: 'a4',
          orientation: 'portrait',
        },
        pagebreak: {
          mode: ['avoid-all', 'css', 'legacy'],
        },
      };

      // Generate PDF
      await html2pdf().set(options).from(element).save();

      console.log('PDF generated successfully');
    } catch (error) {
      console.error('PDF generation failed:', error);

      // Show user-friendly error message
      if (
        confirm(
          'PDF generation failed. Would you like to try the browser print option instead?'
        )
      ) {
        this.printUsingBrowserPrint();
      }
    } finally {
      this.isGeneratingPdf = false;
    }
  }

  // Fallback browser print method
  printUsingBrowserPrint(): void {
    if (!this.selectedReport) return;

    const printContent = this.generatePrintableHTML();

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      alert('Please allow pop-ups for this website to use the print function.');
      return;
    }

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for content to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  }

  private generatePrintableHTML(): string {
    if (!this.selectedReport) return '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Billing Report - ${this.selectedReport.customerName}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
            color: #333;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #007bff;
            margin-bottom: 30px;
            padding-bottom: 15px;
          }
          .header h1 {
            color: #007bff;
            margin: 0;
            font-size: 28px;
          }
          .header h2 {
            margin: 5px 0 0 0;
            color: #666;
            font-size: 20px;
          }
          .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
          }
          .section h3 {
            color: #007bff;
            border-bottom: 2px solid #e9ecef;
            padding-bottom: 8px;
            margin-bottom: 15px;
            font-size: 16px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 10px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 5px 0;
            border-bottom: 1px solid #f8f9fa;
          }
          .label {
            font-weight: bold;
            color: #495057;
            min-width: 150px;
          }
          .value {
            color: #212529;
          }
          .total-row {
            font-size: 18px;
            font-weight: bold;
            color: #007bff;
            background-color: #f8f9fa;
            padding: 10px;
            border-radius: 5px;
            margin-top: 10px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #6c757d;
            border-top: 1px solid #dee2e6;
            padding-top: 15px;
          }
          @media print {
            body { margin: 0; }
            .section { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>BILLING REPORT</h1>
          <h2>${this.selectedReport.customerName}</h2>
        </div>

        <div class="section">
          <h3>Customer Information</h3>
          <div class="info-row">
            <span class="label">Customer Name:</span>
            <span class="value">${this.selectedReport.customerName}</span>
          </div>
          <div class="info-row">
            <span class="label">Email:</span>
            <span class="value">${this.selectedReport.email}</span>
          </div>
          <div class="info-row">
            <span class="label">Phone:</span>
            <span class="value">${this.selectedReport.phoneNumber}</span>
          </div>
        </div>

        <div class="section">
          <h3>Reservation Details</h3>
          <div class="info-row">
            <span class="label">Room Number:</span>
            <span class="value">${this.selectedReport.roomNumber}</span>
          </div>
          <div class="info-row">
            <span class="label">Room Type:</span>
            <span class="value">${this.selectedReport.roomType}</span>
          </div>
          <div class="info-row">
            <span class="label">Check-in Date:</span>
            <span class="value">${new Date(
              this.selectedReport.checkInDate
            ).toLocaleDateString()}</span>
          </div>
          <div class="info-row">
            <span class="label">Check-out Date:</span>
            <span class="value">${new Date(
              this.selectedReport.checkOutDate
            ).toLocaleDateString()}</span>
          </div>
          <div class="info-row">
            <span class="label">Number of Nights:</span>
            <span class="value">${this.selectedReport.nights}</span>
          </div>
          <div class="info-row">
            <span class="label">Reservation Status:</span>
            <span class="value">${
              this.reservationStatusMap[this.selectedReport.reservationStatus]
            }</span>
          </div>
        </div>

        <div class="section">
          <h3>Billing Breakdown</h3>
          <div class="info-row">
            <span class="label">Room Charges:</span>
            <span class="value">Rs. ${this.selectedReport.roomCharges.toLocaleString()}</span>
          </div>
          <div class="info-row">
            <span class="label">Tax:</span>
            <span class="value">Rs. ${this.selectedReport.tax.toLocaleString()}</span>
          </div>
          <div class="info-row">
            <span class="label">Discount:</span>
            <span class="value">Rs. ${this.selectedReport.discount.toLocaleString()}</span>
          </div>
          <div class="info-row">
            <span class="label">Additional Charges:</span>
            <span class="value">Rs. ${this.selectedReport.additionalCharges.toLocaleString()}</span>
          </div>
          <div class="info-row total-row">
            <span class="label">Total Amount Due:</span>
            <span class="value">Rs. ${this.selectedReport.amountDue.toLocaleString()}</span>
          </div>
          <div class="info-row">
            <span class="label">Amount Paid:</span>
            <span class="value">Rs. ${(
              this.selectedReport.amountPaid ?? 0
            ).toLocaleString()}</span>
          </div>
        </div>

        <div class="section">
          <h3>Payment Information</h3>
          <div class="info-row">
            <span class="label">Payment Status:</span>
            <span class="value">${
              this.paymentStatusMap[this.selectedReport.paymentStatus ?? 0]
            }</span>
          </div>
          <div class="info-row">
            <span class="label">Payment Method:</span>
            <span class="value">${
              this.paymentMethodMap[this.selectedReport.paymentMethod ?? 0]
            }</span>
          </div>
          <div class="info-row">
            <span class="label">Transaction ID:</span>
            <span class="value">${
              this.selectedReport.transactionId || 'N/A'
            }</span>
          </div>
          <div class="info-row">
            <span class="label">Processed At:</span>
            <span class="value">${
              this.selectedReport.processedAt
                ? new Date(this.selectedReport.processedAt).toLocaleString()
                : 'N/A'
            }</span>
          </div>
        </div>

        <div class="footer">
          <p>Generated on ${new Date().toLocaleString()}</p>
          <p>This is an automated billing report.</p>
        </div>
      </body>
      </html>
    `;
  }
}
