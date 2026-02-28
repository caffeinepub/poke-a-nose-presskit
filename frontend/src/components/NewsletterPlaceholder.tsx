import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function NewsletterPlaceholder() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder — functionality to be added later
  };

  return (
    <div className="w-full max-w-sm">
      <p className="font-body text-xs uppercase tracking-widest mb-3 opacity-50 body-text">
        Stay Updated
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="flex-1 bg-transparent border-foreground/30 focus:border-foreground text-sm rounded-none"
        />
        <Button
          type="submit"
          variant="default"
          className="rounded-none text-xs tracking-widest uppercase px-4"
        >
          Subscribe
        </Button>
      </form>
    </div>
  );
}
