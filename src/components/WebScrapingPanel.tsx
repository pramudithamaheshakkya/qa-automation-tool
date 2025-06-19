import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, Globe, Search, Settings } from 'lucide-react';
import { scrapePage, ScrapeConfig, ScrapeResult, ScrapedElement } from '@/lib/scraper';

interface WebScrapingPanelProps {
  onElementsScraped: (elements: ScrapedElement[]) => void;
}

const WebScrapingPanel: React.FC<WebScrapingPanelProps> = ({ onElementsScraped }) => {
  const [config, setConfig] = useState<ScrapeConfig>({
    url: 'https://example.com',
    selectors: ['button', 'input', 'a', 'form'],
    depth: 1,
    includeHidden: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScrapeResult | null>(null);

  const handleScrape = async () => {
    setIsLoading(true);
    try {
      const scrapeResult = await scrapePage(config);
      setResult(scrapeResult);
      if (scrapeResult.status === 'success') {
        onElementsScraped(scrapeResult.elements);
      }
    } catch (error) {
      console.error('Scraping failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectorChange = (value: string) => {
    const selectors = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
    setConfig(prev => ({ ...prev, selectors }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Web Scraping Configuration
        </CardTitle>
        <CardDescription>
          Configure web scraping parameters to extract interactive elements from your target website
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* URL Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Target URL</label>
          <Input
            type="url"
            placeholder="https://example.com"
            value={config.url}
            onChange={(e) => setConfig(prev => ({ ...prev, url: e.target.value }))}
          />
        </div>

        {/* Selectors */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Element Selectors</label>
          <Input
            placeholder="button, input, a, form"
            value={config.selectors.join(', ')}
            onChange={(e) => handleSelectorChange(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Comma-separated CSS selectors for elements to scrape
          </p>
        </div>

        {/* Depth Setting */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Crawl Depth</label>
          <Input
            type="number"
            min="1"
            max="5"
            value={config.depth}
            onChange={(e) => setConfig(prev => ({ ...prev, depth: parseInt(e.target.value) || 1 }))}
          />
          <p className="text-xs text-muted-foreground">
            Number of levels to crawl (1 = current page only)
          </p>
        </div>

        {/* Include Hidden Elements */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="text-sm font-medium">Include Hidden Elements</label>
            <p className="text-xs text-muted-foreground">
              Include elements that are not visible on the page
            </p>
          </div>
          <Switch
            checked={config.includeHidden}
            onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeHidden: checked }))}
          />
        </div>

        {/* Scrape Button */}
        <Button 
          onClick={handleScrape} 
          disabled={isLoading || !config.url}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Scraping...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Start Scraping
            </>
          )}
        </Button>

        {/* Results */}
        {result && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Scraping Results</h4>
              <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                {result.status}
              </Badge>
            </div>
            
            {result.status === 'success' ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Found {result.elements.length} interactive elements
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(
                    result.elements.reduce((acc, el) => {
                      acc[el.type] = (acc[el.type] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([type, count]) => (
                    <div key={type} className="flex justify-between text-xs">
                      <span className="capitalize">{type}s:</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-destructive">{result.error}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WebScrapingPanel;