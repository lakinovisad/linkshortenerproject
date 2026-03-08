import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserLinks } from '@/data/links';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink, BarChart3 } from 'lucide-react';
import { CreateLinkDialog } from '@/components/create-link-dialog';
import { EditLinkDialog } from '@/components/edit-link-dialog';
import { DeleteLinkDialog } from '@/components/delete-link-dialog';

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/');
  }

  const links = await getUserLinks(userId);
  
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track your shortened links
          </p>
        </div>
        <CreateLinkDialog />
      </div>

      {links.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-2">No links yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first shortened link to get started
            </p>
            <CreateLinkDialog />
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {links.map((link) => (
            <Card key={link.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl mb-2 flex items-center gap-2">
                      <span className="font-mono text-primary">/{link.shortCode}</span>
                      <Badge variant="secondary" className="ml-2">
                        <BarChart3 className="h-3 w-3 mr-1" />
                        {link.clicks} clicks
                      </Badge>
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Created {new Date(link.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" title="Copy short link">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Visit original URL">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <EditLinkDialog link={link} />
                    <DeleteLinkDialog link={link} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Target:</span>
                  <a
                    href={link.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline truncate"
                  >
                    {link.originalUrl}
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
