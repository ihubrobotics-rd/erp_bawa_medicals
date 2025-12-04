import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-200 dark:bg-[#0D0D0D] text-gray-900 dark:text-gray-200 py-12 transition-colors">
            <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {/* Logo & About */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-2xl text-primary dark:text-blue-400">
                            B-Medicals
                        </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        We provide high-quality products with authentic
                        experience. Our mission is to make shopping seamless and
                        secure.
                    </p>
                    <div className="flex items-center gap-3">
                        {[Facebook, Twitter, Instagram, Linkedin].map(
                            (Icon, idx) => (
                                <a
                                    key={idx}
                                    href="#"
                                    aria-label={Icon.name}
                                    className="text-gray-700 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors duration-300"
                                >
                                    <Icon className="w-5 h-5 hover:scale-110 transition-transform" />
                                </a>
                            )
                        )}
                    </div>
                </div>

                {/* Products */}
                <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                        Products
                    </h3>
                    <ul className="space-y-2">
                        {[
                            "Medicines",
                            "Supplements",
                            "Health Devices",
                            "New Arrivals",
                        ].map((item, idx) => (
                            <li key={idx}>
                                <a
                                    href="#"
                                    className="text-gray-700 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors duration-300"
                                >
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                        Support
                    </h3>
                    <ul className="space-y-2">
                        {["FAQ", "Shipping", "Returns", "Contact Us"].map(
                            (item, idx) => (
                                <li key={idx}>
                                    <a
                                        href="#"
                                        className="text-gray-700 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors duration-300"
                                    >
                                        {item}
                                    </a>
                                </li>
                            )
                        )}
                    </ul>
                </div>

                {/* Newsletter */}
                <div className="flex flex-col">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                        Subscribe
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        Get the latest updates and offers.
                    </p>
                    <form className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-2 w-full">
                        <input
                            type="email"
                            placeholder="Your email"
                            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 
            focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 transition-colors duration-300 w-full"
                        />
                        <button
                            type="submit"
                            className="mt-2 sm:mt-0 px-4 py-2 rounded-md bg-gradient-to-r from-yellow-400 to-orange-600 dark:from-orange-700 dark:to-red-800 text-white font-semibold 
            hover:from-yellow-500 hover:to-orange-700 dark:hover:from-orange-800 dark:hover:to-red-900 transition-all duration-300 w-full sm:w-auto"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            {/* Bottom copyright */}
            <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-6 text-center text-gray-500 text-sm transition-colors">
                &copy; {new Date().getFullYear()} B-Medicals. All rights
                reserved.
            </div>
        </footer>
    );
}
