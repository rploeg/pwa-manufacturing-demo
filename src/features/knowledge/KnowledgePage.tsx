import { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Wrench,
  AlertTriangle,
  FileText,
  TrendingUp,
  ThumbsUp,
  Eye,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { knowledgeService } from '@/data/clients/knowledge';
import type { KnowledgeArticle } from '@/data/types';

export function KnowledgePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [loading, setLoading] = useState(false);

  // Load articles
  useEffect(() => {
    loadArticles();
  }, [selectedCategory, searchQuery]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const results = await knowledgeService.search(searchQuery, {
        category: selectedCategory === 'all' ? undefined : selectedCategory as any,
      });
      setArticles(results);
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkHelpful = async (articleId: string) => {
    try {
      await knowledgeService.markHelpful(articleId);
      // Reload articles to get updated counts
      await loadArticles();
    } catch (error) {
      console.error('Failed to mark article as helpful:', error);
    }
  };

  const categories = [
    { value: 'all', label: 'All Articles', icon: BookOpen },
    { value: 'sop', label: 'SOPs', icon: FileText },
    { value: 'troubleshooting', label: 'Troubleshooting', icon: Wrench },
    { value: 'note', label: 'Notes', icon: BookOpen },
    { value: 'fix', label: 'Quick Fixes', icon: AlertTriangle },
  ];

  const filteredArticles = articles;

  const handleArticleView = async (article: KnowledgeArticle) => {
    setSelectedArticle(article);
    try {
      await knowledgeService.getArticle(article.id); // This increments view count
      await loadArticles(); // Refresh to get updated views
    } catch (error) {
      console.error('Failed to update view count:', error);
    }
  };

  const handleHelpful = async (articleId: string) => {
    await handleMarkHelpful(articleId);
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find((c) => c.value === category);
    const Icon = cat?.icon || BookOpen;
    return <Icon className="w-4 h-4" />;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sop':
        return 'text-blue-600 bg-blue-100';
      case 'troubleshooting':
        return 'text-amber-600 bg-amber-100';
      case 'fix':
        return 'text-green-600 bg-green-100';
      case 'note':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Knowledge Base</h1>
        <p className="text-muted-foreground">
          SOPs, troubleshooting guides, quick fixes, and team notes
        </p>
      </div>

      {/* Search */}
      <Card className="p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles, tags, or machine IDs..."
            className="pl-10"
          />
        </div>
      </Card>

      {/* Categories */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Total Articles</p>
              <p className="text-lg font-bold">{articles.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">Total Views</p>
              <p className="text-lg font-bold">
                {articles.reduce((sum: number, a) => sum + a.views, 0)}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <ThumbsUp className="w-5 h-5 text-amber-500" />
            <div>
              <p className="text-xs text-muted-foreground">Helpful Votes</p>
              <p className="text-lg font-bold">
                {articles.reduce((sum: number, a) => sum + a.helpful, 0)}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-xs text-muted-foreground">Most Popular</p>
              <p className="text-sm font-medium truncate">
                {[...articles].sort((a, b) => b.views - a.views)[0]?.title.slice(0, 20)}...
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Articles List */}
      <div className="space-y-3">
        {filteredArticles.length === 0 ? (
          <Card className="p-8 text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              No articles found. Try a different search or category.
            </p>
          </Card>
        ) : (
          filteredArticles.map((article) => (
            <Card
              key={article.id}
              className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleArticleView(article)}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-2 rounded-lg ${getCategoryColor(article.category)}`}
                >
                  {getCategoryIcon(article.category)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{article.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        By {article.authorName} •{' '}
                        {new Date(article.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                        article.category
                      )}`}
                    >
                      {article.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {article.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      {article.helpful} helpful
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {article.tags.slice(0, 5).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-muted rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${getCategoryColor(
                    selectedArticle.category
                  )}`}
                >
                  {selectedArticle.category}
                </span>
                <h2 className="text-2xl font-bold mb-2">{selectedArticle.title}</h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>By {selectedArticle.authorName}</span>
                  <span>•</span>
                  <span>
                    Updated {new Date(selectedArticle.updatedAt).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {selectedArticle.views} views
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedArticle(null)}
              >
                Close
              </Button>
            </div>

            <div className="prose prose-sm max-w-none mb-6">
              <div className="whitespace-pre-wrap">{selectedArticle.content}</div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {selectedArticle.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-muted rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleHelpful(selectedArticle.id)}
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Helpful ({selectedArticle.helpful})
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
