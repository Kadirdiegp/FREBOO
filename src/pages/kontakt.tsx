import { useState } from 'react';
import Layout from '../components/Layout';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaInstagram, FaEnvelope, FaPhone } from 'react-icons/fa';

const KontaktPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Hier können Sie die E-Mail-Versand-Logik implementieren
      // Zum Beispiel mit einem API-Endpunkt oder einem E-Mail-Service
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulierte Verzögerung
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', category: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative h-[40vh] mb-12 rounded-lg overflow-hidden">
          <Image
            src="/images/IMG_9932.JPG"
            alt="Kontakt Hero"
            fill
            className="object-cover"
            style={{ objectPosition: 'center 15%' }}
            priority
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
              Lass uns zusammenarbeiten
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Über Mich Section */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Über Mich</h2>
            <div className="prose prose-invert">
              <p>
                Hi, ich bin Frederik Bosch - ein leidenschaftlicher Fotograf aus Bremerhaven. 
                Meine Reise in der Fotografie begann vor 6 Jahren, und seitdem 
                habe ich mich auf Motocross, Portrait- und Produktfotografie spezialisiert.
              </p>
              <p>
                Was mich antreibt, ist die Möglichkeit, einzigartige Momente 
                einzufangen und Geschichten durch meine Bilder zu erzählen. Ob 
                es die Action beim Motocross, die Persönlichkeit in Portraits 
                oder die Details in der Produktfotografie ist - jedes Bild hat 
                seine eigene Geschichte.
              </p>
            </div>

            {/* Social Media Links */}
            <div className="flex space-x-6 text-xl">
              <a 
                href="https://www.instagram.com/frebo_media/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#89cff0] transition-colors"
              >
                <FaInstagram size={24} />
              </a>
              <a 
                href="mailto:email@example.com"
                className="hover:text-[#89cff0] transition-colors"
              >
                <FaEnvelope size={24} />
              </a>
              <a 
                href="tel:+49 162 2998971"
                className="hover:text-[#89cff0] transition-colors"
              >
                <FaPhone size={24} />
              </a>
            </div>
          </div>

          {/* Kontaktformular */}
          <div className="bg-zinc-900 p-6 rounded-lg">
            <h2 className="text-3xl font-bold mb-6">Kontakt</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-[#89cff0] focus:ring-1 focus:ring-[#89cff0] outline-none transition-colors"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    E-Mail <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-[#89cff0] focus:ring-1 focus:ring-[#89cff0] outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-[#89cff0] focus:ring-1 focus:ring-[#89cff0] outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-1">
                    Kategorie <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-[#89cff0] focus:ring-1 focus:ring-[#89cff0] outline-none transition-colors"
                  >
                    <option value="">Bitte wählen</option>
                    <option value="motocross">Motocross</option>
                    <option value="portrait">Portrait</option>
                    <option value="product">Produktfotografie</option>
                    <option value="other">Sonstiges</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">
                  Betreff <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-[#89cff0] focus:ring-1 focus:ring-[#89cff0] outline-none transition-colors"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Nachricht <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-[#89cff0] focus:ring-1 focus:ring-[#89cff0] outline-none transition-colors"
                  placeholder="Beschreiben Sie Ihr Anliegen..."
                />
              </div>

              <div className="text-sm text-zinc-400">
                <span className="text-red-500">*</span> Pflichtfelder
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  isSubmitting
                    ? 'bg-zinc-700 cursor-not-allowed'
                    : 'bg-[#89cff0] hover:bg-[#7bbfe0] text-black'
                }`}
              >
                {isSubmitting ? 'Wird gesendet...' : 'Nachricht senden'}
              </button>

              {submitStatus === 'success' && (
                <p className="text-green-500 text-sm mt-2">
                  Danke für deine Nachricht! Ich melde mich bald bei dir.
                </p>
              )}
              {submitStatus === 'error' && (
                <p className="text-red-500 text-sm mt-2">
                  Es gab einen Fehler. Bitte versuche es später noch einmal.
                </p>
              )}
            </form>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default KontaktPage;
