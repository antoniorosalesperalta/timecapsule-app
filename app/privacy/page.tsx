import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, Lock, Eye, Users } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold text-balance mb-2">Política de Privacidad</h1>
          <p className="text-muted-foreground">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Tu Privacidad es Importante
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                En TimeCapsule, entendemos que tus videos y memorias son extremadamente personales. 
                Nos comprometemos a proteger tu privacidad con los más altos estándares de seguridad.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Información que Recopilamos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">Información Personal</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Nombre y dirección de email</li>
                    <li>• Información de contacto de confianza</li>
                    <li>• Contactos familiares</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Contenido de Video</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Videos grabados a través de la aplicación</li>
                    <li>• Metadatos de grabación (fecha, duración)</li>
                    <li>• Configuraciones de privacidad</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Cómo Usamos tu Información
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">Propósito Principal</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Almacenar y proteger tus videos anuales</li>
                    <li>• Facilitar el sistema de legado digital</li>
                    <li>• Enviar notificaciones de check-in anual</li>
                    <li>• Proporcionar soporte técnico</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Lo que NO hacemos</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Vender tu información a terceros</li>
                    <li>• Usar tus videos para publicidad</li>
                    <li>• Compartir contenido sin tu autorización</li>
                    <li>• Analizar el contenido de tus videos</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Compartir Información
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Solo compartimos tu información en las siguientes circunstancias:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Con tus contactos de confianza autorizados</li>
                <li>• Cuando activas manualmente el sistema de legado</li>
                <li>• Por requerimiento legal (solo si es absolutamente necesario)</li>
                <li>• Con proveedores de servicios que nos ayudan a operar la plataforma</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seguridad de Datos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">Medidas de Seguridad</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Encriptación de extremo a extremo para videos</li>
                    <li>• Almacenamiento seguro en la nube</li>
                    <li>• Acceso restringido a datos personales</li>
                    <li>• Auditorías regulares de seguridad</li>
                    <li>• Cumplimiento con GDPR y regulaciones locales</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tus Derechos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Tienes derecho a:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Acceder a tu información personal</li>
                <li>• Corregir datos inexactos</li>
                <li>• Solicitar la eliminación de tu cuenta</li>
                <li>• Exportar tus datos</li>
                <li>• Revocar consentimientos en cualquier momento</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contacto</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Si tienes preguntas sobre esta política de privacidad, contáctanos en:
              </p>
              <p className="font-medium mt-2">privacy@timecapsule-app.com</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
