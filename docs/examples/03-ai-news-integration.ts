/**
 * EJEMPLO: Integración de AI para Análisis de Noticias
 *
 * Sistema completo de análisis de noticias financieras usando OpenAI GPT-4
 * para correlacionar noticias con cotizaciones del dólar.
 *
 * Instalación requerida:
 * npm install openai
 *
 * Variables de entorno requeridas:
 * OPENAI_API_KEY=sk-...
 * NEWS_API_KEY=... (opcional, para NewsAPI.org)
 */

import OpenAI from 'openai';

// ============================================================================
// 1. CONFIGURACIÓN DE OPENAI
// ============================================================================

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ============================================================================
// 2. TIPOS DE DATOS
// ============================================================================

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  url: string;
  source: string;
  publishedAt: string;
  image?: string;
  category?: 'economia' | 'politica' | 'internacional' | 'finanzas';
}

export interface DolarQuotation {
  oficial: number;
  blue: number;
  mep: number;
  ccl: number;
  tarjeta: number;
  crypto: number;
}

export interface AIAnalysis {
  summary: string; // Resumen ejecutivo (2-3 líneas)
  impact: {
    level: 'alto' | 'medio' | 'bajo'; // Nivel de impacto
    direction: 'alcista' | 'bajista' | 'neutral'; // Tendencia esperada
    confidence: number; // 0-100: confianza del análisis
  };
  affected_rates: string[]; // Qué tipos de dólar se verán afectados
  reasoning: string; // Explicación detallada
  recommendations: string[]; // Recomendaciones para inversores
  keywords: string[]; // Palabras clave extraídas
  sentiment: 'positivo' | 'negativo' | 'neutral';
}

// ============================================================================
// 3. CLASE DE ANÁLISIS AI
// ============================================================================

export class NewsAnalyzer {
  /**
   * Analiza una noticia y determina su impacto en las cotizaciones
   */
  async analyzeNews(article: NewsArticle, currentRates: DolarQuotation): Promise<AIAnalysis> {
    try {
      const prompt = this.buildPrompt(article, currentRates);

      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt(),
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: 'json_object' }, // Forzar respuesta JSON
      });

      const response = completion.choices[0].message.content;
      if (!response) throw new Error('No response from AI');

      const analysis: AIAnalysis = JSON.parse(response);

      return analysis;
    } catch (error) {
      console.error('Error analyzing news:', error);
      throw error;
    }
  }

  /**
   * Analiza múltiples noticias en batch
   */
  async analyzeBatch(articles: NewsArticle[], currentRates: DolarQuotation): Promise<AIAnalysis[]> {
    const analyses = await Promise.all(
      articles.map((article) => this.analyzeNews(article, currentRates))
    );

    return analyses;
  }

  /**
   * Genera resumen agregado de múltiples análisis
   */
  async generateMarketSummary(
    analyses: AIAnalysis[],
    currentRates: DolarQuotation
  ): Promise<string> {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `Eres un analista financiero senior especializado en mercado cambiario argentino.
          Genera resúmenes ejecutivos concisos y profesionales.`,
        },
        {
          role: 'user',
          content: `Basándote en estos ${analyses.length} análisis de noticias recientes:

${analyses.map((a, i) => `${i + 1}. ${a.summary} (Impacto: ${a.impact.level}, Tendencia: ${a.impact.direction})`).join('\n')}

Cotizaciones actuales:
- Oficial: $${currentRates.oficial}
- Blue: $${currentRates.blue}
- MEP: $${currentRates.mep}
- CCL: $${currentRates.ccl}

Genera un resumen ejecutivo del mercado cambiario (máximo 5 líneas), indicando:
1. Tendencia general del mercado
2. Factores clave que están influyendo
3. Proyección de corto plazo
4. Recomendación principal para inversores`,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    return completion.choices[0].message.content || '';
  }

  /**
   * Prompt del sistema para el AI
   */
  private getSystemPrompt(): string {
    return `Eres un analista financiero experto en economía argentina y mercado cambiario.

TU TAREA:
Analizar noticias y determinar su impacto en las cotizaciones del dólar en Argentina.

CONTEXTO:
- Argentina tiene control de cambios y múltiples tipos de cambio
- Dólar Oficial: Tasa regulada por el gobierno
- Dólar Blue: Mercado paralelo (ilegal pero tolerado)
- Dólar MEP: Operaciones bursátiles (legal)
- Dólar CCL: Contado con liquidación (legal)
- Dólar Tarjeta: Para consumos en el exterior
- Dólar Cripto: A través de criptomonedas

FORMATO DE RESPUESTA:
Devuelve SIEMPRE un JSON válido con esta estructura exacta:
{
  "summary": "Resumen ejecutivo en 2-3 líneas",
  "impact": {
    "level": "alto|medio|bajo",
    "direction": "alcista|bajista|neutral",
    "confidence": 85
  },
  "affected_rates": ["blue", "mep", "oficial"],
  "reasoning": "Explicación detallada del análisis",
  "recommendations": ["Recomendación 1", "Recomendación 2"],
  "keywords": ["palabra1", "palabra2"],
  "sentiment": "positivo|negativo|neutral"
}

CRITERIOS DE ANÁLISIS:
1. Impacto político: Medidas del gobierno, elecciones, cambios de gabinete
2. Impacto económico: Inflación, reservas, balanza comercial, deuda
3. Impacto internacional: Relación con FMI, commodities, Brasil
4. Impacto social: Protestas, huelgas, inestabilidad

SÉ PRECISO, OBJETIVO Y BASADO EN DATOS.`;
  }

  /**
   * Construye el prompt para una noticia específica
   */
  private buildPrompt(article: NewsArticle, rates: DolarQuotation): string {
    return `Analiza esta noticia y determina su impacto en el mercado cambiario argentino:

NOTICIA:
Título: ${article.title}
Fuente: ${article.source}
Fecha: ${article.publishedAt}

Contenido:
${article.content}

COTIZACIONES ACTUALES:
- Dólar Oficial: $${rates.oficial.toFixed(2)}
- Dólar Blue: $${rates.blue.toFixed(2)}
- Dólar MEP: $${rates.mep.toFixed(2)}
- Dólar CCL: $${rates.ccl.toFixed(2)}
- Dólar Tarjeta: $${rates.tarjeta.toFixed(2)}
- Dólar Cripto: $${rates.crypto.toFixed(2)}

Brecha oficial vs blue: ${(((rates.blue - rates.oficial) / rates.oficial) * 100).toFixed(1)}%

ANÁLISIS REQUERIDO:
Proporciona un análisis completo siguiendo el formato JSON especificado.`;
  }
}

// ============================================================================
// 4. SERVICIO DE NOTICIAS
// ============================================================================

export class NewsService {
  private newsApiKey = process.env.NEWS_API_KEY;

  /**
   * Obtiene noticias de NewsAPI.org
   */
  async fetchFromNewsAPI(): Promise<NewsArticle[]> {
    if (!this.newsApiKey) {
      throw new Error('NEWS_API_KEY not configured');
    }

    const response = await fetch(
      `https://newsapi.org/v2/everything?q=dolar+argentina&language=es&sortBy=publishedAt&apiKey=${this.newsApiKey}`
    );

    if (!response.ok) throw new Error('Failed to fetch news');

    const data = await response.json();

    return data.articles.map((article: any) => ({
      id: article.url,
      title: article.title,
      content: article.description || article.content || '',
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
      image: article.urlToImage,
    }));
  }

  /**
   * Obtiene noticias de RSS feeds (alternativa gratuita)
   */
  async fetchFromRSS(): Promise<NewsArticle[]> {
    // TODO: Implementar con rss-parser
    // npm install rss-parser
    // const Parser = require('rss-parser');
    // const parser = new Parser();

    const feeds = [
      'https://www.ambito.com/rss/economia.xml',
      'https://www.cronista.com/rss/finanzas/',
      // Agregar más feeds
    ];

    // Implementación básica (requiere rss-parser)
    return [];
  }

  /**
   * Filtra noticias relevantes para el dólar
   */
  filterRelevantNews(articles: NewsArticle[]): NewsArticle[] {
    const keywords = [
      'dolar',
      'dólar',
      'cambio',
      'divisa',
      'tipo de cambio',
      'bcra',
      'banco central',
      'reservas',
      'inflacion',
      'inflación',
      'economia',
      'economía',
      'fmi',
      'deuda',
      'cepo',
    ];

    return articles.filter((article) => {
      const text = `${article.title} ${article.content}`.toLowerCase();
      return keywords.some((keyword) => text.includes(keyword));
    });
  }
}

// ============================================================================
// 5. NEXT.JS API ROUTE
// ============================================================================

// app/api/news/analyze/route.ts
/*
import { NextRequest, NextResponse } from 'next/server';
import { NewsAnalyzer } from '@/lib/ai/news-analyzer';

export async function POST(request: NextRequest) {
  try {
    const { article, currentRates } = await request.json();

    const analyzer = new NewsAnalyzer();
    const analysis = await analyzer.analyzeNews(article, currentRates);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Analysis failed',
      },
      { status: 500 }
    );
  }
}
*/

// ============================================================================
// 6. HOOK DE REACT
// ============================================================================

// hooks/useNewsAnalysis.ts
/*
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

export function useNewsAnalysis() {
  const mutation = useMutation({
    mutationFn: async ({ article, rates }) => {
      const response = await fetch('/api/news/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article,
          currentRates: rates,
        }),
      });

      if (!response.ok) throw new Error('Analysis failed');
      return response.json();
    },
  });

  return {
    analyze: mutation.mutateAsync,
    analyzing: mutation.isPending,
    analysis: mutation.data?.analysis,
    error: mutation.error,
  };
}
*/

// ============================================================================
// 7. COMPONENTE DE EJEMPLO
// ============================================================================

/*
// components/NewsWithAI.tsx
'use client';

import { useNewsAnalysis } from '@/hooks/useNewsAnalysis';
import { useDolares } from '@/hooks/useDolares';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FaRobot, FaChartLine, FaLightbulb } from 'react-icons/fa';

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsWithAI({ article }: NewsCardProps) {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const { data: dolarData } = useDolares();
  const { analyze, analyzing, analysis } = useNewsAnalysis();

  async function handleAnalyze() {
    if (!dolarData) return;

    const rates = {
      oficial: dolarData.find(d => d.nombre === 'Oficial')?.venta || 0,
      blue: dolarData.find(d => d.nombre === 'Blue')?.venta || 0,
      mep: dolarData.find(d => d.nombre === 'MEP')?.venta || 0,
      ccl: dolarData.find(d => d.nombre === 'CCL')?.venta || 0,
      tarjeta: dolarData.find(d => d.nombre === 'Tarjeta')?.venta || 0,
      crypto: dolarData.find(d => d.nombre === 'Cripto')?.venta || 0,
    };

    await analyze({ article, rates });
    setShowAnalysis(true);
  }

  return (
    <Card variant="elevated" padding="lg" hover="glow">
      {article.image && (
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}

      <div className="flex items-start gap-3 mb-3">
        <Badge variant="info" size="sm">
          {article.source}
        </Badge>
        <span className="text-xs text-secondary">
          {new Date(article.publishedAt).toLocaleDateString('es-AR')}
        </span>
      </div>

      <h3 className="text-xl font-bold mb-3">{article.title}</h3>
      <p className="text-secondary text-sm mb-4 line-clamp-3">
        {article.content}
      </p>

      <div className="flex gap-2 mb-4">
        <Button
          variant="primary"
          size="sm"
          onClick={handleAnalyze}
          disabled={analyzing}
        >
          <FaRobot className="mr-2" />
          {analyzing ? 'Analizando...' : 'Analizar con AI'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(article.url, '_blank')}
        >
          Leer más
        </Button>
      </div>

      {showAnalysis && analysis && (
        <div className="mt-4 space-y-4">
          // Resumen
          <div className="p-4 glass rounded-lg border border-accent-emerald/20">
            <h4 className="text-sm font-semibold text-accent-emerald mb-2 flex items-center gap-2">
              <FaChartLine /> Resumen Ejecutivo
            </h4>
            <p className="text-sm text-secondary">{analysis.summary}</p>
          </div>

          // Impacto
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 glass rounded-lg text-center">
              <p className="text-xs text-secondary mb-1">Impacto</p>
              <Badge
                variant={
                  analysis.impact.level === 'alto'
                    ? 'error'
                    : analysis.impact.level === 'medio'
                    ? 'warning'
                    : 'success'
                }
              >
                {analysis.impact.level}
              </Badge>
            </div>
            <div className="p-3 glass rounded-lg text-center">
              <p className="text-xs text-secondary mb-1">Tendencia</p>
              <Badge
                variant={
                  analysis.impact.direction === 'alcista'
                    ? 'error'
                    : analysis.impact.direction === 'bajista'
                    ? 'success'
                    : 'default'
                }
              >
                {analysis.impact.direction}
              </Badge>
            </div>
            <div className="p-3 glass rounded-lg text-center">
              <p className="text-xs text-secondary mb-1">Confianza</p>
              <p className="text-sm font-bold text-accent-emerald">
                {analysis.impact.confidence}%
              </p>
            </div>
          </div>

          // Razonamiento
          <div className="p-4 glass rounded-lg">
            <h4 className="text-sm font-semibold mb-2">Análisis Detallado</h4>
            <p className="text-sm text-secondary whitespace-pre-line">
              {analysis.reasoning}
            </p>
          </div>

          // Recomendaciones
          {analysis.recommendations.length > 0 && (
            <div className="p-4 glass rounded-lg border border-warning/20">
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <FaLightbulb className="text-warning" /> Recomendaciones
              </h4>
              <ul className="space-y-1">
                {analysis.recommendations.map((rec, i) => (
                  <li key={i} className="text-sm text-secondary flex gap-2">
                    <span>•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          // Dolares afectados
          {analysis.affected_rates.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs text-secondary">Afecta a:</span>
              {analysis.affected_rates.map((rate) => (
                <Badge key={rate} size="sm">
                  {rate}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
*/

// ============================================================================
// 8. CACHE Y OPTIMIZACIÓN
// ============================================================================

export class CachedNewsAnalyzer extends NewsAnalyzer {
  private cache = new Map<string, { analysis: AIAnalysis; timestamp: number }>();
  private cacheDuration = 60 * 60 * 1000; // 1 hora

  async analyzeNews(article: NewsArticle, currentRates: DolarQuotation): Promise<AIAnalysis> {
    // Generar clave de cache
    const cacheKey = `${article.id}-${JSON.stringify(currentRates)}`;

    // Verificar cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      console.log('Using cached analysis');
      return cached.analysis;
    }

    // Si no hay cache, analizar
    const analysis = await super.analyzeNews(article, currentRates);

    // Guardar en cache
    this.cache.set(cacheKey, {
      analysis,
      timestamp: Date.now(),
    });

    return analysis;
  }

  clearCache() {
    this.cache.clear();
  }
}

// ============================================================================
// 9. EXPORTACIONES
// ============================================================================

export default {
  NewsAnalyzer,
  NewsService,
  CachedNewsAnalyzer,
};
