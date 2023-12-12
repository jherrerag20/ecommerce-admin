import { Button } from '@/components/ui/button';
import { Page, Text, View, Document, StyleSheet, PDFViewer, pdf } from '@react-pdf/renderer';
import { ResOrderColumn } from './columns';


// Estilos del documento PDF
const pdfStyles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      backgroundColor: '#FFFF'
    },
    section: {
      margin: 20,
      padding: 20,
      flexGrow: 1
    },
  });

// Componente funcional para el botón de descarga del PDF
const DownloadPDFButton: React.FC<{
  data: ResOrderColumn[];
  totalPrice: string;
  orderInfo: {
    clientName: string;
    clientPhone: string;
    address: string;
  };
}> = ({ data, totalPrice, orderInfo }) => {
  const downloadPDF = async () => {
    const pdfBlob = await pdf(
      <Document>
        <Page size="A4" style={pdfStyles.page}>
          <View style={pdfStyles.section}>
            <Text style={{ marginBottom: 10, fontSize: 20, fontWeight: 'bold', color: 'black' }}>Import e-nova</Text>

            <View style={{ marginBottom: 20 }} />

            <Text style={{ marginBottom: 10, fontSize: 12, fontWeight: 'light', color: 'gray' }}>Resumen de la Orden</Text>

            <View style={{ marginBottom: 20 }} />

            <View style={{ flexDirection: 'row' }}>
              <Text style={{ marginRight: 10, fontSize: 10 }}>Nombre Del Cliente: {orderInfo.clientName}</Text>
              <Text style={{ marginRight: 10, fontSize: 10 }}>Teléfono: {orderInfo.clientPhone}</Text>
              <Text style={{ fontSize: 10, textAlign: "right" }}>Direccion: {orderInfo.address}</Text>
            </View>

            <View style={{ marginBottom: 20 }} />

            {/* Header row con fondo rosa, texto blanco, letra más pequeña y centrada */}
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#FF69B4',
                borderBottom: 1,
                borderColor: '#000',
                paddingBottom: 5,
                alignItems: 'center',
              }}
            >
              <View style={{ flex: 2, justifyContent: 'center' }}>
                <Text style={{ color: '#FFF', fontSize: 12, textAlign: 'center' }}>Nombre del Producto</Text>
              </View>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ color: '#FFF', fontSize: 12, textAlign: 'center' }}>Cantidad</Text>
              </View>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ color: '#FFF', fontSize: 12, textAlign: 'center' }}>Precio</Text>
              </View>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ color: '#FFF', fontSize: 12, textAlign: 'center' }}>Precio Total</Text>
              </View>
            </View>

            {data.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  borderBottom: 1,
                  borderColor: '#000',
                  paddingTop: 5,
                  paddingBottom: 5,
                  alignItems: 'center', // Center the text vertically
                }}
              >
                <View style={{ flex: 2 }}>
                  <Text style={{ fontSize: 9, textAlign: 'center' }}>{item.productName}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 9, textAlign: 'center' }}>{item.amount}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 9, textAlign: 'center' }}>{item.price}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 9, textAlign: 'center' }}>{item.totalPrice}</Text>
                </View>
              </View>
            ))}

            <View style={{ marginBottom: 20 }} />

            <Text style={{ marginBottom: 10, fontSize: 16, fontWeight: 'bold'}}>
              Total: {totalPrice}
            </Text>
          </View>
        </Page>
      </Document>
    ).toBlob();

    const link = document.createElement('a');
    link.href = URL.createObjectURL(pdfBlob);
    link.download = `factura_${orderInfo.clientPhone}.pdf`;
    link.click();
  };

  return <Button onClick={downloadPDF} variant="outline">Descargar ticket</Button>;
};


export default DownloadPDFButton;