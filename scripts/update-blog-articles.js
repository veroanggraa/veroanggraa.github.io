#!/usr/bin/env node

/**
 * Medium Articles Fetcher
 * Fetches articles from Medium RSS feed and generates blog-articles.json
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const RSS_FEED_URL = 'https://medium.com/feed/@veroanggra';
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'blog-articles.json');
const MAX_ARTICLES = 8;

// Category mapping based on keywords
const CATEGORY_KEYWORDS = {
  'Android Development': ['android', 'kotlin', 'jetpack', 'compose', 'sdk', 'activity', 'fragment', 'viewmodel', 'livedata', 'room', 'coroutine'],
  'Spatial Computing': ['xr', 'vr', 'ar', 'spatial', 'orka', 'meta quest', 'vision pro', 'immersive', '3d', 'metaverse'],
  'Machine Learning': ['mlkit', 'ai', 'machine learning', 'model', 'training', 'tensorflow', 'pytorch', 'neural', 'detection'],
  'Graphics': ['agsl', 'shader', 'gpu', 'rendering', 'graphics', 'opengl', 'vulkan', 'canvas', 'animation'],
  'Performance': ['performance', 'optimization', 'memory', 'speed', 'efficiency', 'cache', 'lazy', 'benchmark'],
  'Accessibility': ['accessibility', 'a11y', 'inclusive', 'screen reader', 'talkback', 'voiceover', 'assistive'],
  'Architecture': ['architecture', 'clean architecture', 'mvvm', 'mvi', 'design pattern', 'solid', 'dependency injection'],
  'UI/UX': ['ui', 'ux', 'interface', 'design', 'layout', 'material', 'compose ui', 'jetpack compose'],
  'GDE Insights': ['gde', 'google developer expert', 'community', 'mentoring', 'speaking', 'conference', 'workshop'],
  'Flutter': ['flutter', 'dart', 'widget', 'bloc', 'provider', 'riverpod', 'cross-platform']
};

// Code snippet templates by category
const CODE_SNIPPETS = {
  'Android Development': [
    `class MainActivity : AppCompatActivity() {
    private val viewModel: MainViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        setupObservers()
    }
}`,
    `@Composable
fun UserProfile(user: User) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
    ) {
        Text(user.name, style = MaterialTheme.typography.h6)
        Text(user.email, style = MaterialTheme.typography.body2)
    }
}`
  ],
  'Spatial Computing': [
    `@Composable
fun SpatialDashboard() {
    Column {
        ImmersiveContent {
            ObjectDetection()
            RealtimeAnalytics()
        }
    }
}`,
    `fun createSpatialPanel(): SpatialPanel {
    return SpatialPanel.Builder()
        .setMode(SpatialMode.IMMERSIVE)
        .enableHandTracking(true)
        .build()
}`
  ],
  'Machine Learning': [
    `val detector = ObjectDetection.getClient(options)

detector.process(image)
    .addOnSuccessListener { results ->
        processDetectionResults(results)
    }
    .addOnFailureListener { e ->
        Log.e(TAG, "Detection failed", e)
    }`,
    `fun loadModel(context: Context): TensorFlowLite {
    val options = Interpreter.Options()
    options.setNumThreads(4)
    return TensorFlowLite.loadModelFile(context, "model.tflite", options)
}`
  ],
  'Graphics': [
    `// AGSL Shader Example
uniform shader image;
uniform float brightness;
uniform vec2 resolution;

vec4 main(vec2 fragCoord) {
    vec2 uv = fragCoord / resolution;
    vec4 color = image.eval(uv);
    color.rgb *= brightness;
    return color;
}`,
    `fun createRenderEffect(): RenderEffect {
    val blurEffect = RenderEffect.createBlurEffect(
        10f, 10f, Shader.TileMode.CLAMP
    )
    return RenderEffect.createChainEffect(
        blurEffect,
        RenderEffect.createColorFilterEffect(
            ColorFilter.tint(Color.BLUE)
        )
    )
}`
  ],
  'Performance': [
    `@Composable
fun OptimizedList(items: List<Item>) {
    LazyColumn {
        items(items, key = { it.id }) { item ->
            ItemView(item)
        }
    }
}`,
    `// Memory optimization
class ImageCache private constructor() {
    private val cache = LruCache<String, Bitmap>(20)

    fun get(key: String): Bitmap? = cache.get(key)

    fun put(key: String, bitmap: Bitmap) {
        cache.put(key, bitmap)
    }
}`
  ],
  'Accessibility': [
    `// Accessibility best practices
contentDescription = "Upload profile picture"
minTouchTargetSize = 48.dp
isScreenReaderFriendly = true
supportsDynamicType = true`,
    `class AccessibleButton(context: Context) : AppCompatButton(context) {
    init {
        importantForAccessibility = IMPORTANT_FOR_ACCESSIBILITY_YES
        contentDescription = "Submit form"
    }
}`
  ],
  'Architecture': [
    `class MainViewModel(
    private val repository: UserRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow<UiState>(UiState.Loading)
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()

    fun loadUser() {
        viewModelScope.launch {
            _uiState.value = UiState.Loading
            try {
                val user = repository.getUser()
                _uiState.value = UiState.Success(user)
            } catch (e: Exception) {
                _uiState.value = UiState.Error(e.message)
            }
        }
    }
}`,
    `// Dependency Injection with Hilt
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    @Provides
    @Singleton
    fun provideRetrofit(): Retrofit {
        return Retrofit.Builder()
            .baseUrl("https://api.example.com/")
            .addConverterFactory(MoshiConverterFactory.create())
            .build()
    }
}`
  ],
  'UI/UX': [
    `@Composable
fun ModernCard(
    title: String,
    description: String,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .padding(8.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(title, style = MaterialTheme.typography.titleMedium)
            Spacer(modifier = Modifier.height(8.dp))
            Text(description, style = MaterialTheme.typography.bodyMedium)
        }
    }
}`
  ],
  'GDE Insights': [
    `fun shareKnowledge(): Impact {
    return community * contributions * workshops
}

// Impact = Community + Contributions + Workshops
val impact = shareKnowledge()`,
    `class CommunityEngagement {
    fun organizeWorkshop(topic: String): WorkshopResult {
        val attendees = registerAttendees()
        val feedback = collectFeedback()
        return WorkshopResult(attendees, feedback)
    }
}`
  ],
  'Flutter': [
    `class MyWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<Cubit, State>(
      builder: (context, state) {
        return Text(state.value);
      },
    );
  }
}`,
    `Future<void> fetchData() async {
  try {
    final response = await http.get(Uri.parse('https://api.example.com/data'));
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      setState(() => items = data);
    }
  } catch (e) {
    print('Error: $e');
  }
}`
  ],
  'default': [
    `// Technical implementation example
fun solveProblem(input: Input): Output {
    val processed = input.transform()
    val result = processed.compute()
    return result.optimize()
}`,
    `class Solution {
    fun execute() {
        val data = loadData()
        val processed = processData(data)
        saveResult(processed)
    }
}`
  ]
};

/**
 * Fetch RSS feed from Medium
 */
function fetchRSSFeed(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Simple XML parser - extracts item elements from RSS
 */
function parseRSSXML(xmlString) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xmlString)) !== null) {
    const itemContent = match[1];
    const item = {
      title: extractTag(itemContent, 'title'),
      link: extractTag(itemContent, 'link'),
      pubDate: extractTag(itemContent, 'pubDate'),
      description: extractTag(itemContent, 'description'),
      content: extractTag(itemContent, 'content:encoded') || extractTag(itemContent, 'description')
    };
    items.push(item);
  }

  return items;
}

/**
 * Extract content from XML tag
 */
function extractTag(content, tagName) {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = content.match(regex);
  if (match) {
    // Remove CDATA wrapper if present
    return match[1].replace('<
![CDATA[', '').replace(']]>', '').trim();
  }
  return '';
}

/**
 * Strip HTML tags from string
 */
function stripHTML(html) {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Convert RSS date to YYYY-MM-DD format
 */
function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (e) {
    return '2024-01-01'; // Fallback date
  }
}

/**
 * Categorize article based on title and content
 */
function categorizeArticle(title, content) {
  const text = (title + ' ' + content).toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        return category;
      }
    }
  }

  return 'Android Development'; // Default category
}

/**
 * Generate code snippet based on category
 */
function generateCodeSnippet(category, title) {
  const snippets = CODE_SNIPPETS[category] || CODE_SNIPPETS['default'];
  // Use title as a simple hash to pick consistent snippet
  const index = title.length % snippets.length;
  return snippets[index];
}

/**
 * Generate excerpt from content
 */
function generateExcerpt(content, maxLength = 150) {
  const text = stripHTML(content);
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Estimate reading time
 */
function estimateReadTime(content) {
  const text = stripHTML(content);
  const words = text.split(/\s+/).length;
  const minutes = Math.ceil(words / 200); // Average reading speed: 200 words/min
  return `${minutes} min read`;
}

/**
 * Main execution function
 */
async function main() {
  console.log('🔄 Fetching Medium articles from:', RSS_FEED_URL);

  try {
    // Fetch RSS feed
    const rssXML = await fetchRSSFeed(RSS_FEED_URL);
    console.log('✅ RSS feed fetched successfully');

    // Parse XML
    const items = parseRSSXML(rssXML);
    console.log(`📊 Found ${items.length} articles`);

    // Process articles
    const articles = items.slice(0, MAX_ARTICLES).map((item, index) => {
      const category = categorizeArticle(item.title, item.content);
      const excerpt = generateExcerpt(item.description);
      const snippet = generateCodeSnippet(category, item.title);
      const date = formatDate(item.pubDate);
      const readTime = estimateReadTime(item.content);

      return {
        id: index + 1,
        title: item.title,
        category: category,
        excerpt: excerpt,
        snippet: snippet,
        date: date,
        link: item.link,
        readTime: readTime
      };
    });

    // Ensure we have exactly MAX_ARTICLES
    while (articles.length < MAX_ARTICLES) {
      const index = articles.length + 1;
      articles.push({
        id: index,
        title: `Coming Soon: New Article ${index}`,
        category: 'Android Development',
        excerpt: 'More exciting content coming soon. Stay tuned for new articles about Android development and technology.',
        snippet: CODE_SNIPPETS['default'][0],
        date: new Date().toISOString().split('T')[0],
        link: 'https://veroanggra.medium.com/',
        readTime: '5 min read'
      });
    }

    // Write to JSON file
    const jsonData = JSON.stringify(articles, null, 2);
    fs.writeFileSync(OUTPUT_FILE, jsonData, 'utf8');

    console.log(`✅ Successfully generated ${OUTPUT_FILE}`);
    console.log(`📝 ${articles.length} articles processed`);
    console.log('');
    console.log('Article Summary:');
    articles.forEach(article => {
      console.log(`  - ${article.title} (${article.category})`);
    });
    console.log('');
    console.log('🎉 Done! You can now view your updated blog section.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();