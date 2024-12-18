import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-white p-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-start">
            <Logo width={150} height={50} className="mb-4" />
            <p>Professionelle Fotografie für Ihre besonderen Momente</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Kontakt</h3>
            <p>Email: info@frebo-media.com</p>
            <p>Tel: +49 123 456789</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Folgen Sie uns</h3>
            <div className="space-x-4">
              <a href="https://www.instagram.com/frebo_media/" className="hover:text-zinc-300">Instagram</a>
              
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>&copy; {new Date().getFullYear()} FREBO MEDIA. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
}
