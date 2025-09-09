"use client"

import { KeyRound, Mail, Twitter, Linkedin, Github, Shield, Lock, Zap, Heart } from "lucide-react"

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Security", href: "#security" },
    { name: "Pricing", href: "#pricing" },
    { name: "API", href: "#api" }
  ],
  company: [
    { name: "About", href: "#about" },
    { name: "Blog", href: "#blog" },
    { name: "Careers", href: "#careers" },
    { name: "Contact", href: "#contact" }
  ],
  resources: [
    { name: "Documentation", href: "#docs" },
    { name: "Help Center", href: "#help" },
    { name: "Community", href: "#community" },
    { name: "Status", href: "#status" }
  ],
  legal: [
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Terms of Service", href: "#terms" },
    { name: "Cookie Policy", href: "#cookies" },
    { name: "GDPR", href: "#gdpr" }
  ]
}

const socialLinks = [
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "LinkedIn", href: "#", icon: Linkedin },
  { name: "GitHub", href: "#", icon: Github },
  { name: "Email", href: "mailto:contact@one-password.com", icon: Mail }
]

export function FooterSection() {
  return (
    <footer className="bg-black border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-3 rounded-xl hover:rotate-12 transition-transform duration-300">
                  <KeyRound className="h-8 w-8 text-black" />
                </div>
                <span className="text-2xl font-bold text-white">One-Password</span>
              </div>
              
              <p className="text-slate-300 leading-relaxed mb-6 max-w-md">
                The most secure and intuitive platform for managing API keys. 
                Trusted by thousands of developers and enterprises worldwide.
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center space-x-2 text-slate-400 text-sm">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span>SOC 2 Type II</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-400 text-sm">
                  <Lock className="w-4 h-4 text-blue-400" />
                  <span>AES-256</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-400 text-sm">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span>99.9% Uptime</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-slate-800 hover:bg-blue-500 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Sections */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="lg:col-span-1">
                <h3 className="text-white font-semibold text-lg mb-6 capitalize">
                  {category}
                </h3>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-slate-300 hover:text-blue-400 transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-12 border-t border-slate-800">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Stay updated with our latest features
            </h3>
            <p className="text-slate-300 mb-8">
              Get notified about new security features, product updates, and best practices.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-slate-400 text-sm">
              © 2024 One-Password. All rights reserved. Built with security in mind.
            </div>
            
            <div className="flex items-center space-x-6 text-slate-400 text-sm">
              <span className="flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-400 fill-current" />
                <span>for developers</span>
              </span>
              <div className="w-1 h-1 bg-slate-600 rounded-full" />
              <span>Version 2.0.1</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}