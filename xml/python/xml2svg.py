import xml.etree.ElementTree as ET


def find(child, parent):
    return parent.find('{http://www.uniovi.es}'+child)


class Svg(object):

    def __init__(self):
        """
        Crea el elemento raíz y el espacio de nombres
        """
        self.puntos = []
        self.alt_list = []
        self.dist_dictionary = {}
        self.height = 450
        self.width = 1600
        self.raiz = ET.Element('svg', xmlns="http://www.w3.org/2000/svg", width=str(self.width+100), height=str(self.height+100))

    def save(self,filename):
        """
        Escribe el archivo SVG con declaración y codificación
        """
        arbol = ET.ElementTree(self.raiz)
        arbol.write(filename, encoding='utf-8', xml_declaration=True)
        print('Archivo '+filename+' guardado correctamente')
    
    def generate_polyline(self):
        #Generamos linea que une todos los puntos de altitud comenzando y acabando por el 0
        element = ET.SubElement(self.raiz,'polyline',points=" ".join(self.puntos),fill="none",stroke="red")
        element.attrib['stroke-width'] = "6"
        #Generamos linea que une inicio y final
        element = ET.SubElement(self.raiz,'polyline',points=" ".join([self.puntos[0],self.puntos[-1]]),fill="none",stroke="red")
        element.attrib['stroke-width'] = "6"
    
    def add_text_element(self,cx,text):
        element = ET.SubElement(self.raiz,'text',fill="black",x=cx,y="460",style="writing-mode: tb; glyph-orientation-vertical: 0;")
        element.attrib['font-size']="20"
        element.text = text

    def generate_points(self):

        cx = 40
        x = (self.width-(cx*2)) / sum(self.dist_dictionary.values())
        y = self.height / max(self.alt_list)
        
        self.puntos.append('0,450')
        for dist, alt in zip(self.dist_dictionary, self.alt_list):
            cy = self.height - (alt * y)
            cx += self.dist_dictionary[dist] * x
            self.puntos.append(str(cx)+','+str(cy))
            self.add_text_element(str(cx),dist)

        self.puntos.append(str(cx+40)+','+str(self.height))


    def parse_distances_and_altitudes(self, hitos):
        for hito in hitos:
            name = find('nombre',hito).text
            coordenadas = find('coordenadas',hito)
            alt = float(find('altitud', coordenadas).text)
            dist = float(find('distancia', hito).text)
            self.alt_list.append(alt)
            self.dist_dictionary[name] = dist
    
    def parse_inicio(self, inicio):
        name = find('lugar',inicio).text
        coordenadas = find('coordenadas',inicio)
        alt = float(find('altitud', coordenadas).text)
        dist = 0
        self.alt_list.append(alt)
        self.dist_dictionary[name] = dist

    def reset(self):
        self.puntos = []
        self.alt_list = []
        self.dist_dictionary = {}
        self.raiz = ET.Element('svg', xmlns="http://www.w3.org/2000/svg", width=str(self.width+100), height=str(self.height+100))


def transformar_xml(archivo_xml):
    try:
        arbol = ET.parse(archivo_xml)
        
    except IOError:
        print ('No se encuentra el archivo ', archivo_xml)
        exit()
        
    except ET.ParseError:
        print("Error procesando en el archivo XML = ", archivo_xml)
        exit()
    
    root = arbol.getroot()
    
    i = 0
    
    svg = Svg()

    for ruta in root.findall('{http://www.uniovi.es}ruta'):
        svg.reset()
        svg.parse_inicio(ruta.find('.{http://www.uniovi.es}inicio'))
        svg.parse_distances_and_altitudes(ruta.findall('.{http://www.uniovi.es}hitos/{http://www.uniovi.es}hito'))
        svg.generate_points()
        svg.generate_polyline()
        svg.save(ruta.attrib['id']+'.svg')

def main():
    file = open('rutasEsquema.xml','r',encoding='utf-8')
   
    transformar_xml(file)

if __name__ == "__main__":
    main()