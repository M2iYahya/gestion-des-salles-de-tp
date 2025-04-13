import Link from 'next/link';
import React from 'react';

interface HeaderProps {
  title: string;
  links: { label: string; href: string }[];
  activeLinkIndex: number; // Indicates which link is active
}

const Header: React.FC<HeaderProps> = ({ title, links, activeLinkIndex }) => {
  return (
    <div className='mt-4'>
      <h1 className="poppins-semibold text-3xl">{title}</h1>
      <div className="w-full mb-4">
        <ul className="flex gap-4">
          {links.map((link, index) => (
            <Link key={index} href={link.href}>
              <li
                className={`poppins-medium text-md py-2 ${
                  activeLinkIndex === index ? 'border-b-2' : 'hover:border-b-2'
                } border-black cursor-pointer`}
              >
                {link.label}
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Header;
