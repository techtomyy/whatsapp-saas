import React from 'react';

const TrustedBySection = () => {
  const companies = [
    {
      title: "E-commerce Stores",
      desc: "Online retailers & shops",
      color: "from-orange-300 to-orange-500",
      iconPath: [
        "M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z",
        "M9 8V17H11V8H9ZM13 8V17H15V8H13Z"
      ]
    },
    {
      title: "Marketing Agencies",
      desc: "Digital marketing experts",
      color: "from-sky-300 to-sky-500",
      iconPath: [
        "M3 3V21H21V3H3ZM5 19V5H19V19H5Z",
        "M7 17H9V10H7V17ZM11 17H13V7H11V17ZM15 17H17V13H15V17Z"
      ]
    },
    {
      title: "SaaS Companies",
      desc: "Software & tech platforms",
      color: "from-purple-300 to-purple-500",
      iconPath: [
        "M12 2L2 7L12 12L22 7L12 2Z",
        "M2 17L12 22L22 17",
        "M2 12L12 17L22 12"
      ]
    },
    {
      title: "Local Businesses",
      desc: "Community & retail stores",
      color: "from-lime-300 to-lime-500",
      iconPath: [
        "M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5S14.5 7.62 14.5 9S13.38 11.5 12 11.5Z"
      ]
    },
    {
      title: "Enterprise Teams",
      desc: "Large organizations",
      color: "from-gray-300 to-gray-500",
      iconPath: [
        "M16 4C18.21 4 20 5.79 20 8S18.21 12 16 12S12 10.21 12 8S13.79 4 16 4ZM16 14C18.67 14 22 15.33 22 18V20H10V18C10 15.33 13.33 14 16 14Z",
        "M8 12C10.21 12 12 10.21 12 8S10.21 4 8 4S4 5.79 4 8S5.79 12 8 12ZM8 14C5.33 14 0 15.33 0 18V20H8V18C8 16.22 8.72 14.63 10 13.53C9.25 13.19 8.54 13 8 13V14Z"
      ]
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-12">
          Trusted by 500+ businesses worldwide
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {companies.map((company, index) => (
            <div key={index} className="group cursor-pointer">
              <div className={`bg-gradient-to-br ${company.color} rounded-2xl p-6 mb-4 transition-all duration-300 hover:scale-105 hover:shadow-md`}>
                <div className="w-10 h-10 mx-auto text-white">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    {company.iconPath.map((path, i) => (
                      <path key={i} d={path} />
                    ))}
                  </svg>
                </div>
              </div>
              <h3 className="font-semibold text-gray-800 text-sm">{company.title}</h3>
              <p className="text-xs text-gray-500">{company.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;
