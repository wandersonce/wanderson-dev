import { createClient } from '@/prismicio';
import { PrismicNextLink } from '@prismicio/next';
import Link from 'next/link';

export default async function Header() {
  const client = createClient();
  const settings = await client.getSingle('settings');

  return (
    <div className="top-0 z-50 mx-auto mx-7xl md:sticky md:top-4">
      <nav>
        <ul>
          <li>
            <Link href="/" aria-label="Home Page">
              {settings.data.name}
            </Link>
          </li>
          {settings.data.nav_item.map(({ link, label }, index) => (
            <li key={index}>
              <PrismicNextLink field={link}>{label}</PrismicNextLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
