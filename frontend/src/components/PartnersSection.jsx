const partners = [
  { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
  { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
  { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
  {name: 'Exl', logo:'data:image/png;base64,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'},
  { name: 'Dell', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg' },
  {name: 'HCL', logo:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNwnx0rjCIyBTjD9kYdpMvb9wcLZCid2YFuA&s'},
  { name: 'Cognizant', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Cognizant_logo_2022.svg' },
  { name: 'Wipro', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg' },
];

const PartnersSection = () => (
  <section className="py-12 pt-5 pb-5 mt-15 mb-15 border-t border-gray-100 bg-white" data-aos="fade-up">
    <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-[0.25em] mb-8">
      Trusted By Professionals From
    </p>
    <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-14 px-6">
      {partners.map((p) => (
        <img 
          key={p.name} 
          src={p.logo} 
          alt={p.name} 
          className="h-7 lg:h-9 w-auto object-contain hover:scale-110 transition-transform duration-300"
        />
      ))}
    </div>
  </section>
);

export default PartnersSection;