const InvestmentFooter = () => {
  return (
    <footer className="bg-[#0a0a0a] text-white py-12 px-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Copyright */}
          <div>
            <span className="text-xl font-bold tracking-[0.2em] mb-4 block">
              T Ξ S L Λ
            </span>
            <p className="text-sm text-gray-500">© 2026 Tesla Investment</p>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy & Legal
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default InvestmentFooter;
