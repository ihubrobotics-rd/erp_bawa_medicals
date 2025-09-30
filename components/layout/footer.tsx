import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & About */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            
            <span className="font-bold text-xl text-white">B-Medicals</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            We provide high-quality products with authentic experience. Our mission is to make shopping seamless and secure.
          </p>
          <div className="flex items-center gap-3">
            <a href="#" aria-label="Facebook" className="hover:text-white transition">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-white transition">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-white transition">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-white transition">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Products */}
        <div>
          <h3 className="font-semibold text-white mb-4">Products</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white transition">Medicines</a></li>
            <li><a href="#" className="hover:text-white transition">Supplements</a></li>
            <li><a href="#" className="hover:text-white transition">Health Devices</a></li>
            <li><a href="#" className="hover:text-white transition">New Arrivals</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold text-white mb-4">Support</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white transition">FAQ</a></li>
            <li><a href="#" className="hover:text-white transition">Shipping</a></li>
            <li><a href="#" className="hover:text-white transition">Returns</a></li>
            <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-semibold text-white mb-4">Subscribe</h3>
          <p className="text-gray-400 text-sm mb-3">Get the latest updates and offers.</p>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-2 rounded-md border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="submit" className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="mt-12 border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} CarbonTrace Technologies. All rights reserved.
      </div>
    </footer>
  )
}
