import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MediaDownloadButton() {
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = '/assets/PokeANose_MediaImages.zip';
    a.download = 'PokeANose_MediaImages.zip';
    a.type = 'application/zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Button
      variant="outline"
      onClick={handleDownload}
      className="rounded-none text-xs tracking-widest uppercase gap-2 border-foreground/40 hover:border-foreground"
    >
      <Download size={14} />
      Download all Screenshots as ZIP (6.6MB)
    </Button>
  );
}
