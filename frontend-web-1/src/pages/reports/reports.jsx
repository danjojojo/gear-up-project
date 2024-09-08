import './reports.scss';
import PageLayout from '../../components/page-layout/page-layout';
import PDFReport from '../../components/pdf-report/pdf-report';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';

const Reports = () => {
    return (
        <div className='reports p-3'>
            <PageLayout
                leftContent={
                    <div>
                        <PDFDownloadLink
                            document={<PDFReport />} fileName='Report'
                        >
                            <button className='download-btn'>
                                Download
                            </button>
                        </PDFDownloadLink>

                        
                        <PDFViewer className="pdf-viewer" style={{ width: '100%', height: '500px', marginTop: '20px' }}>
                            <PDFReport />
                        </PDFViewer>
                    </div>
                }
                rightContent={<div></div>}
            />
        </div>
    );
};

export default Reports;