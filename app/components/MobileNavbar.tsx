import Link from "next/link";

const MobileNavbar = () => {
  return (
    <div className="w-full text-center bg-white text-notion-text p-4 border-b border-notion-border">
      <Link href="/" className="font-bold hover:bg-notion-bg-hover px-2 py-1 rounded">
        uclagrades.com
      </Link>
      <div className="flex items-center justify-center gap-2 mt-2">
        <Link href="/" className="font-semibold hover:bg-notion-bg-hover px-2 py-1 rounded">
          Home
        </Link>
        <Link href="/about" className="font-semibold hover:bg-notion-bg-hover px-2 py-1 rounded">
          About
        </Link>
        <a
          target="blank"
          rel="noopener noreferrer"
          href="https://docs.google.com/forms/d/e/1FAIpQLSfxHpdeTTvFzX4slKx-KGKgvqZM3GfABXIlHcuBHXiKhLhpwQ/viewform"
          className="font-semibold hover:bg-notion-bg-hover px-2 py-1 rounded"
        >
          Contact
        </a>
      </div>
    </div>
  );
};

export { MobileNavbar };
