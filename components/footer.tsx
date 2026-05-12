import { Activity } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-primary" />
              <span className="font-mono text-lg font-bold text-primary">DiabeSense</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Aplikasi skrining risiko diabetes yang mudah, cepat, dan akurat untuk membantu Anda menjaga kesehatan.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-serif font-semibold text-foreground">Menu</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/" className="hover:text-primary transition-colors">Dashboard</a>
              </li>
              <li>
                <a href="/screening" className="hover:text-primary transition-colors">Skrining</a>
              </li>
              <li>
                <a href="/login" className="hover:text-primary transition-colors">Login</a>
              </li>
            </ul>
          </div>

          {/* Team */}
          <div className="space-y-4">
            <h4 className="font-serif font-semibold text-foreground">Tim DiabeSense</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Dikembangkan oleh tim yang peduli dengan kesehatan masyarakat Indonesia.
            </p>
            <p className="text-xs text-muted-foreground">
              Dibuat dengan penuh dedikasi untuk kesehatan Anda.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} DiabeSense. Semua hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  )
}
