import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart, Users, Shield, Clock, Star, Mail, Github } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a TimeCapsule
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-balance mb-2">Acerca de TimeCapsule</h1>
          <p className="text-muted-foreground">Tu legado digital para las futuras generaciones</p>
        </div>

        <div className="space-y-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Heart className="w-6 h-6 mr-2" />
                Nuestra Misión
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-lg leading-relaxed">
                En TimeCapsule, creemos que cada persona tiene una historia única que merece ser preservada. 
                Nuestra misión es ayudarte a crear un legado digital significativo que inspire y conecte 
                con las futuras generaciones de tu familia.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  El Concepto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">
                  TimeCapsule nació de una simple pregunta: ¿Cómo podemos preservar nuestra sabiduría, 
                  amor y experiencias para que las futuras generaciones puedan conocer quiénes fuimos realmente?
                </p>
                <p className="text-muted-foreground">
                  La respuesta fue crear una plataforma que permita grabar videos anuales de un minuto, 
                  creando una cápsula del tiempo digital que capture tu evolución a través de los años.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Para Quién es
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">
                  TimeCapsule es para cualquiera que quiera dejar un legado significativo:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Padres que quieren que sus hijos los recuerden</li>
                  <li>• Abuelos que quieren compartir su sabiduría</li>
                  <li>• Personas que quieren preservar su historia</li>
                  <li>• Familias que valoran las conexiones intergeneracionales</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Nuestros Valores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <Heart className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h4 className="font-medium mb-1">Amor</h4>
                  <p className="text-sm text-muted-foreground">
                    Creemos en el poder del amor para conectar generaciones
                  </p>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h4 className="font-medium mb-1">Privacidad</h4>
                  <p className="text-sm text-muted-foreground">
                    Tu contenido es sagrado y lo protegemos con la máxima seguridad
                  </p>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h4 className="font-medium mb-1">Legado</h4>
                  <p className="text-sm text-muted-foreground">
                    Ayudamos a crear un legado que perdure más allá del tiempo
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Características Principales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-sm font-medium">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Grabación Anual</h4>
                      <p className="text-sm text-muted-foreground">
                        Graba un video de un minuto cada año para documentar tu crecimiento
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-sm font-medium">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Sistema de Legado</h4>
                      <p className="text-sm text-muted-foreground">
                        Configura contactos de confianza para activar el envío cuando sea necesario
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-sm font-medium">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Check-in Anual</h4>
                      <p className="text-sm text-muted-foreground">
                        Sistema de verificación para confirmar que estás bien
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-sm font-medium">4</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Códigos QR</h4>
                      <p className="text-sm text-muted-foreground">
                        Genera códigos QR para lápidas que conecten con tu legado
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-sm font-medium">5</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Seguridad Máxima</h4>
                      <p className="text-sm text-muted-foreground">
                        Encriptación de extremo a extremo y almacenamiento seguro
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-sm font-medium">6</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Compilación Automática</h4>
                      <p className="text-sm text-muted-foreground">
                        Videos se compilan automáticamente en un recuerdo final
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>El Equipo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                TimeCapsule fue creado por un equipo apasionado por conectar generaciones y preservar 
                las historias que hacen únicas a las familias.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h4 className="font-medium mb-2">Nuestra Visión</h4>
                  <p className="text-sm text-muted-foreground">
                    Crear una plataforma que permita a las personas dejar un legado digital significativo 
                    que inspire y conecte con las futuras generaciones.
                  </p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h4 className="font-medium mb-2">Nuestro Compromiso</h4>
                  <p className="text-sm text-muted-foreground">
                    Mantener la más alta seguridad y privacidad mientras proporcionamos una experiencia 
                    simple y significativa para crear legados digitales.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contacto y Soporte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <h4 className="font-medium">Email de Soporte</h4>
                      <p className="text-sm text-muted-foreground">support@timecapsule-app.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Github className="w-5 h-5 text-primary" />
                    <div>
                      <h4 className="font-medium">Código Abierto</h4>
                      <p className="text-sm text-muted-foreground">Contribuye al proyecto</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-primary" />
                    <div>
                      <h4 className="font-medium">Califícanos</h4>
                      <p className="text-sm text-muted-foreground">Comparte tu experiencia</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <h4 className="font-medium">Comunidad</h4>
                      <p className="text-sm text-muted-foreground">Únete a otros usuarios</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/">
                Comenzar Mi TimeCapsule
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
