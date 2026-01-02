const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          
          {/* Company Name */}
          <div>
            <h3 className="text-lg font-bold mb-4">주식회사 헤이하이컴퍼니(Hey, Hi)</h3>
          </div>

          {/* Info Grid */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm text-gray-400">
            <div className="flex flex-col md:flex-row gap-2 md:gap-8">
              <p><span className="font-bold text-white">Location.</span> 9F, Signature Tower, 100, Cheonggyecheon-ro, Jung-gu, Seoul Office</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 md:gap-12">
              <p><span className="font-bold text-white">T.</span> +82. 02. 713. 5525</p>
              <p><span className="font-bold text-white">E-mail.</span> ceo@heyhicompany.com</p>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 mt-4 border-t border-gray-900/50">
            <p className="text-xs text-gray-500">ⓒ HEYHICOMPANY. All rights reserved.</p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
