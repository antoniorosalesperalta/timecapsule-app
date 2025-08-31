import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold text-balance mb-2">Términos y Condiciones</h1>
          <p className="text-muted-foreground">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Aceptación de Términos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Al usar TimeCapsule, aceptas estos términos y condiciones. Si no estás de acuerdo con alguna parte, 
                no debes usar nuestro servicio.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Descripción del Servicio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                TimeCapsule es una plataforma que te permite:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Grabar videos anuales para crear un legado digital</li>
                <li>• Almacenar de forma segura tus memorias</li>
                <li>• Configurar un sistema de legado para tus seres queridos</li>
                <li>• Compartir tu legado cuando llegue el momento apropiado</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Responsabilidades del Usuario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">Debes:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Proporcionar información verdadera y actualizada</li>
                    <li>• Mantener la confidencialidad de tu cuenta</li>
                    <li>• Usar el servicio solo para fines legales</li>
                    <li>• Respetar los derechos de otros usuarios</li>
                    <li>• Cumplir con todas las leyes aplicables</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">No debes:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Compartir contenido ofensivo o inapropiado</li>
                    <li>• Intentar acceder a cuentas de otros usuarios</li>
                    <li>• Usar el servicio para actividades comerciales no autorizadas</li>
                    <li>• Interferir con el funcionamiento del servicio</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Propiedad Intelectual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                <strong>Tu contenido:</strong> Mantienes todos los derechos sobre tus videos y contenido personal.
              </p>
              <p className="text-muted-foreground">
                <strong>Nuestra plataforma:</strong> TimeCapsule y su tecnología están protegidos por derechos de autor.
              </p>
              <p className="text-muted-foreground">
                <strong>Licencia:</strong> Nos otorgas una licencia limitada para almacenar y procesar tu contenido 
                únicamente para proporcionar el servicio.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacidad y Seguridad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Tu privacidad es fundamental. Nuestras prácticas de privacidad están detalladas en nuestra 
                <Link href="/privacy" className="text-primary hover:underline ml-1">
                  Política de Privacidad
                </Link>.
              </p>
              <p className="text-muted-foreground">
                Implementamos medidas de seguridad robustas, pero no podemos garantizar la seguridad absoluta 
                de la información transmitida por internet.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
                Limitación de Responsabilidad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                TimeCapsule se proporciona "tal como está" sin garantías de ningún tipo.
              </p>
              <p className="text-muted-foreground">
                No seremos responsables por:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Pérdida de datos o contenido</li>
                <li>• Interrupciones del servicio</li>
                <li>• Daños indirectos o consecuenciales</li>
                <li>• Problemas técnicos fuera de nuestro control</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <XCircle className="w-5 h-5 mr-2 text-red-600" />
                Terminación del Servicio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Puedes cancelar tu cuenta en cualquier momento. Al cancelar:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Tu contenido será eliminado permanentemente</li>
                <li>• No habrá reembolso por servicios no utilizados</li>
                <li>• Podemos retener cierta información por razones legales</li>
              </ul>
              <p className="text-muted-foreground">
                Podemos suspender o terminar tu cuenta si violas estos términos.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modificaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                Los cambios serán notificados a través de la aplicación o por email.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ley Aplicable</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Estos términos se rigen por las leyes de España. Cualquier disputa será resuelta 
                en los tribunales competentes de Madrid.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contacto</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Si tienes preguntas sobre estos términos, contáctanos en:
              </p>
              <p className="font-medium mt-2">legal@timecapsule-app.com</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
