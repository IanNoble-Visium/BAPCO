/**
 * Video Manifest for BAPCO TruContext Dashboard
 * 
 * Categories based on Veo 3.1 prompt structure:
 * - cinematic: Sweeping drone shots, aerial views, dramatic refinery landscapes
 * - process: Macro shots, turbines, control rooms, equipment focus
 * - data: Neural networks, holograms, data visualization, technology
 * - human: Engineers, AR displays, safety protocols, teamwork
 * - abstract: Logo reveals, particle effects, geometric patterns, transitions
 */

export const VIDEO_CATEGORIES = {
  CINEMATIC: 'cinematic',
  PROCESS: 'process',
  DATA: 'data',
  HUMAN: 'human',
  ABSTRACT: 'abstract'
};

export const VIDEO_MANIFEST = [
  // Category 1: Cinematic & Establishing Shots (1-10)
  { id: 1, file: '1_prompt_a_202601160406_c8ejc.mp4', category: 'cinematic' },
  { id: 2, file: '2_prompt_an_202601160406_phcos.mp4', category: 'cinematic' },
  { id: 3, file: '3_prompt_a_202601160406_rjt1p.mp4', category: 'cinematic' },
  { id: 4, file: '4_prompt_a_202601160406_imk9w.mp4', category: 'cinematic' },
  { id: 5, file: '5_prompt_a_202601160406_h4h52.mp4', category: 'cinematic' },
  { id: 6, file: '6_prompt_a_202601160406_27jkb.mp4', category: 'cinematic' },
  { id: 7, file: '7_prompt_a_202601160406_86ddv.mp4', category: 'cinematic' },
  { id: 8, file: '8_prompt_a_202601160406_jq7c1.mp4', category: 'cinematic' },
  { id: 9, file: '9_prompt_an_202601160407_hqlvt.mp4', category: 'cinematic' },
  { id: 10, file: '10_prompt_a_202601160408_7uh7c.mp4', category: 'cinematic' },

  // Category 2: Process & Equipment Focus (11-20)
  { id: 11, file: '11_category_2_202601160917_uefpx.mp4', category: 'process' },
  { id: 12, file: '12_prompt_a_202601160918_yfut3.mp4', category: 'process' },
  { id: 13, file: '13_prompt_a_202601160918_codxo.mp4', category: 'process' },
  { id: 14, file: '14_prompt_an_202601160918_6zica.mp4', category: 'process' },
  { id: 15, file: '15_prompt_a_202601160918_c4uqv.mp4', category: 'process' },
  { id: 16, file: '16_prompt_a_202601160918_8eeyp.mp4', category: 'process' },
  { id: 17, file: '17_prompt_a_202601160918_komlg.mp4', category: 'process' },
  { id: 18, file: '18_prompt_a_202601160918_7eid4.mp4', category: 'process' },
  { id: 19, file: '19_prompt_a_202601160918_tjygv.mp4', category: 'process' },
  { id: 20, file: '20_prompt_a_202601160918_rjrd3.mp4', category: 'process' },

  // Category 3: Data & Technology (21-30)
  { id: 21, file: '21_category_3_202601160918_o8vfy.mp4', category: 'data' },
  { id: 22, file: '22_prompt_a_202601160918_zv13q.mp4', category: 'data' },
  { id: 23, file: '23_prompt_a_202601160918_b158j.mp4', category: 'data' },
  { id: 24, file: '24_prompt_an_202601160919_pj1cl.mp4', category: 'data' },
  { id: 25, file: '25_prompt_a_202601160919_7w2gs.mp4', category: 'data' },
  { id: 26, file: '26_prompt_a_202601160919_urefs.mp4', category: 'data' },
  { id: 27, file: '27_prompt_a_202601160919_w1pgl.mp4', category: 'data' },
  { id: 28, file: '28_prompt_a_202601160919_9nrrk.mp4', category: 'data' },
  { id: 29, file: '29_prompt_a_202601160919_ik9wx.mp4', category: 'data' },
  { id: 30, file: '30_prompt_an_202601160919_ma7le.mp4', category: 'data' },

  // Category 4: Human Element & Safety (31-40)
  { id: 31, file: '31_prompt_a_202601160919_714qk.mp4', category: 'human' },
  { id: 32, file: '32_prompt_a_202601160919_q7e1s.mp4', category: 'human' },
  { id: 33, file: '33_prompt_an_202601160919_y70ig.mp4', category: 'human' },
  { id: 34, file: '34_prompt_a_202601160920_cf1o7.mp4', category: 'human' },
  { id: 35, file: '35_prompt_a_202601160920_knnpb.mp4', category: 'human' },
  { id: 36, file: '36_prompt_a_202601160920_hm4hb.mp4', category: 'human' },
  { id: 37, file: '37_prompt_a_202601160920_e89sq.mp4', category: 'human' },
  { id: 38, file: '38_prompt_a_202601160920_vibiu.mp4', category: 'human' },
  { id: 39, file: '39_prompt_a_202601160920_gta6p.mp4', category: 'human' },
  { id: 40, file: '40_prompt_a_202601160930_9vq8u.mp4', category: 'human' },

  // Category 5: Abstract & Transitions (41-51)
  { id: 41, file: '41_category_5_202601160920_d4k63.mp4', category: 'abstract' },
  { id: 42, file: '42_prompt_a_202601160931_w8fjb.mp4', category: 'abstract' },
  { id: 43, file: '43_prompt_a_202601160920_wgxr7.mp4', category: 'abstract' },
  { id: 44, file: '44_prompt_an_202601160920_d3fc1.mp4', category: 'abstract' },
  { id: 45, file: '45_prompt_a_202601160920_q7olf.mp4', category: 'abstract' },
  { id: 46, file: '46_prompt_a_202601160920_i7fts.mp4', category: 'abstract' },
  { id: 47, file: '47_prompt_a_202601160920_lnhqc.mp4', category: 'abstract' },
  { id: 48, file: '48_prompt_a_202601160920_6oyn3.mp4', category: 'abstract' },
  { id: 49, file: '49_prompt_an_202601160921_0v2ce.mp4', category: 'abstract' },
  { id: 50, file: '50_prompt_a_202601160930_q403r.mp4', category: 'abstract' },
  { id: 51, file: '50_prompt_a_202601160931_omxkn.mp4', category: 'abstract' }
];

/**
 * Get videos filtered by category
 * @param {string|string[]} categories - Category or array of categories to filter by
 * @returns {Array} Filtered video array
 */
export function getVideosByCategory(categories) {
  if (!categories || categories === 'all') {
    return VIDEO_MANIFEST;
  }
  
  const categoryArray = Array.isArray(categories) ? categories : [categories];
  return VIDEO_MANIFEST.filter(video => categoryArray.includes(video.category));
}

/**
 * Get a randomized playlist of videos
 * @param {string|string[]} categories - Optional category filter
 * @returns {Array} Shuffled video array
 */
export function getRandomizedPlaylist(categories) {
  const videos = getVideosByCategory(categories);
  return [...videos].sort(() => Math.random() - 0.5);
}

/**
 * Get video URL path
 * @param {string} filename - Video filename
 * @returns {string} Full path to video
 */
export function getVideoPath(filename) {
  return `/videos/${filename}`;
}
