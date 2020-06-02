(function($) {
    "use strict"
    var map_to_display_names = {
        'autoencoder': 'Autoencoding',
        'curvature': '3D Curvature',
        'class_places': 'Scene Classification',
        'denoise': 'Denoising Autoencoding',
        'edge2d': '2D Texture Edges',
        'edge3d': '3D Occlusion Edges',
        'ego_motion': 'Triplet Camera Pose',
        'fix_pose': 'Pairwise Fixated Camera Pose',
        'keypoint2d': '2D Keypoints',
        'keypoint3d': '3D Keypoints',
        'non_fixated_pose': 'Pairwise Non-fixated Camera Pose',
        'point_match': 'Point Matching',
        'reshade': 'Reshading',
        'rgb2depth': 'Depth',
        'rgb2mist': 'Euclidean Distance',
        'rgb2sfnorm': 'Normals',
        'room_layout': 'Room Layout',
        'segment25d': 'Unsupervised 2.5D Segm.',
        'segment2d': 'Unsupervised 2D Segm.',
        'vanishing_point_well_defined': 'Vanishing Points',
        'segmentsemantic_rb': 'Semantic Segmentation',
        'class_selected': 'Object Classification (100)',
        'class_1000': 'Object Classification',
        'random': 'Random Projection Feature',
        'self': 'Task-Specific',
        'pixels': 'Only Image',
        'impainting_whole': 'Image In-painting',
        'colorization': 'Colorization',
        'jigsaw': 'Jigsaw Puzzle',
        'rgb2sfnormb': 'Baseline U-Net Normals',
        'rgb2depthb': 'Baseline U-Net Depth',
        'reshadeb': 'Baseline U-Net Reshading',
        'curvature_baseline': 'Curvature (Baseline Readout)',
        'curvature_consistency': 'Curvature',
        'edge2d_baseline' : '2D Edges (Baseline Readout)',
        'edge2d_consistency' : '2D Edges',
        'edge3d_baseline' : 'Occlusion Edges (Baseline Readout)',
        'edge3d_consistency' : 'Occlusion Edges',
        'keypoint2d_baseline' : '2D Keypoints (Baseline Readout)',
        'keypoint2d_consistency' : '2D Keypoints',
        'keypoint3d_baseline' : '3D Keypoints (Baseline Readout)',
        'keypoint3d_consistency' : '3D Keypoints',

        'rgb2normal_cycle' : 'Cycle-Consis. Baseline',
        'rgb2normal_geonet' : 'GeoNet Baseline Normals',
        'rgb2normal_multitask' : 'Multitask Baseline Normals',

        'rgb2depth_geonet' : 'GeoNet Baseline Depth',
        'rgb2depth_multitask' : 'Multitask Baseline Depth',

        'rgb2reshading_multitask' : 'Multitask Baseline Reshading',

        'rgb2sfnorm1': 'Consistency Normals',
        'rgb2depth1': 'Consistency Depth',
        'reshade1': 'Consistency Reshading',
        'kenburns': 'From Consistency Depth',

        'rgb2normal_taskonomy':'Taskonomy Baseline Normals',
        'rgb2depth_taskonomy' :'Taskonomy Baseline Depth',
        'rgb2reshading_taskonomy': 'Taskonomy Baseline Reshading',
        'energy': 'Energy vs Error Scatterplot',
        'energy_2d': 'Spatial Energy (Darker→More Certain)',
        'energy_2d1': 'Uncertainty (Energy)',
        'energy_dist': 'Distribution of the Energy',         
   }


    var random_queries = {
     '0': 'aa00g7y29fsyx3',
'1': 'aa01r8sr0jw6x2',
'2': 'aa099k6dbiyjg',
'3': 'aa0alckp2pqczr',
'4': 'aa0cwies80c56v',
'5': 'aa0dgbjxam65b',
'6': 'aa0ge8a6kaaybw',
'7': 'aa0m530jjmdtyj',
'8': 'aa0v9xax1660kg',
'9': 'aa0wd5du2yt8hh',
'10': 'aa17m2y942my5',
'11': 'aa198704uvq4s',
'12': 'aa1vlaf40r68d',
'13': 'aa1xemnzcv9jg',
'14': 'aa20aokiyhwlw',
'15': 'aa22n4dt1p238',
'16': 'aa26m4iit8f9j',
'17': 'aa2b9k4vobw9b',
'18': 'aa2bswo5h1wcu',
'19': 'aa2ft2jpvso5j',
'20': 'aa2hwxz7hj0s',
'21': 'aa2k7bd2ex9dn',
'22': 'aa2t7oytqqx78',
'23': 'aa2tx6pt8tvkx',
'24': 'aa2uf3rbx2viy',
'25': 'aa2w3yumz568u',
'26': 'aa2x44wx287ic',
'27': 'aa30coa24l3pf',
'28': 'aa32zvndz8087',
'29': 'aa334xcnqdw1t',
'30': 'aa37gyqu228w4',
'31': 'aa38gxm741mog',
'32': 'aa3bzztkkjcya',
'33': 'aa3ggcy5bpa6f',
'34': 'aa3hbhji4q7d4',
'35': 'aa3jemyfqj8kh',
'36': 'aa3ldc4tzzddr',
'37': 'aa3lykok2d9pr',
'38': 'aa3yi6bs0v5yw',
'39': 'aa40bbfc0pe9',
'40': 'aa47p3e4lx2tw',
'41': 'aa49j3yx1krjb',
'42': 'aa4a2vyowgo4s',
'43': 'aa4hhgstjhc41',
'44': 'aa4itc9sj6ntt',
'45': 'aa4ogyiahugaq',
'46': 'aa507ya1u1prj',
'47': 'aa50v1rmpy0fb',
'48': 'aa52a7tmlffyg',
'49': 'aa53x1jv4l2om',
'50': 'aa59nol0luf4n',
'51': 'aa5gtmlbgyn6',
'52': 'aa5hkk980m1x5',
'53': 'aa5ivv4d5u3ti',
'54': 'aa5jc5xnfolbo',
'55': 'aa5jwl3j0ta4d',
'56': 'aa5lphz4uuq2',
'57': 'aa5me0exy1cub',
'58': 'aa5mic3sjj18c',
'59': 'aa5mk9xlbupy',
'60': 'aa5n0pk71fsek',
'61': 'aa5rf6be30799',
'62': 'aa5zlzqxi1fts',
'63': 'aa60ufskyyljr',
'64': 'aa60w8xs5ovmx',
'65': 'aa6anueuyx8bn',
'66': 'aa6cuusfd8us',
'67': 'aa6hoggurekv',
'68': 'aa6ipywqejoxx',
'69': 'aa6jupcw5thc',
'70': 'aa6kg2giq3cv3',
'71': 'aa6la9oa90z2',
'72': 'aa6lhjvrtcal8',
'73': 'aa6lwjbg1uuwc',
'74': 'aa6mqwyom80xb',
'75': 'aa6mu42fz9u3m',
'76': 'aa6nc4lsbdgg6',
'77': 'aa6o8c05e95u',
'78': 'aa6qgecqfeax',
'79': 'aa6waqeqe8rby',
'80': 'aa6xyuqx3rmjg',
'81': 'aa700giet4vw',
'82': 'aa7d4cjx4tw2q',
'83': 'aa7fqwmodmm9h',
'84': 'aa7j5ibfhj3js',
'85': 'aa7r12nkfnlkf',
'86': 'aa7ycj6jmwv8t',
'87': 'aa80c4zsshulp',
'88': 'aa81ijbs7mqem',
'89': 'aa82b53qz3ppc',
'90': 'aa8d97h754e7g',
'91': 'aa8mckxspa5p',
'92': 'aa8onyle4ls58',
'93': 'aa8vwqzx48ns',
'94': 'aa91msuh6dysh',
'95': 'aa92bqrm1wcti',
'96': 'aa94lhn4c8mmv',
'97': 'aa96913z7b4ku',
'98': 'aa98w1qxqr2ih',
'99': 'aa9iqwnmx9go6',
'100': 'aa9l0np5oupad',
'101': 'aa9ytd6adiet',
'102': 'aaa0ej1gq0y3m',
'103': 'aaa5a7h9uixm7',
'104': 'aaa5c3agirwrc',
'105': 'aaa6l0ydqnehi',
'106': 'aaa6szwmtgs7',
'107': 'aaaccvnjq3osb',
'108': 'aaaqh47izjpud',
'109': 'aaasqk1jrm3',
'110': 'aaatxagcrusjj',
'111': 'aaauh4u01rmlj',
'112': 'aaawp9xqtd4c9',
'113': 'aaax68p6o5lel',
'114': 'aaax9tgnkhqe5',
'115': 'aaaxcevftbbiv',
'116': 'aaaz0kb4mzoo',
'117': 'aaazgchb46ek',
'118': 'aab4ooxhudcvr',
'119': 'aab5ibp2g7rpn',
'120': 'aab7220mkd3as',
'121': 'aabkf8wsc5cja',
'122': 'aablzu482ini',
'123': 'aabugwj1693ch',
'124': 'aabvpdwmaar2',
'125': 'aacasxlym0rhb',
'126': 'aacatxp6qypsj',
'127': 'aaccddrq7cjn7',
'128': 'aaccf1rf03oj8',
'129': 'aacd4t8nu7hmo',
'130': 'aacmf7622j1mt',
'131': 'aacnfcf00889a',
'132': 'aacnw38du3g1q',
'133': 'aacr6c2kv4txt',
'134': 'aacrgxbzf9ivu',
'135': 'aacwe8pf8afa4',
'136': 'aacxmyy5iar5',
'137': 'aacxvff5zu5f',
'138': 'aacyhywbsid8h',
'139': 'aad22etkql6wt',
'140': 'aad82q7in48e',
'141': 'aadjnrxuggcml',
'142': 'aadq0tyhh00z8',
'143': 'aadrmax5ye7il',
'144': 'aadsnbwu376xe',
'145': 'aaduaxwxyflc',
'146': 'aaduockyx30v',
'147': 'aadwzp89kahnn',
'148': 'aadxfwzfjr8vm',
'149': 'aae67bw5gb5fu',
'150': 'aaef90e283ugb',
'151': 'aaeg1u1ugmdew',
'152': 'aaekb12le999c',
'153': 'aaem2pjgb5ty8',
'154': 'aaenxpv9fsuss',
'155': 'aaeq1gppqkn9u',
'156': 'aaeqx5wywcbs',
'157': 'aaeuu14nyo8ro',
'158': 'aaf9xo6ephhin',
'159': 'aafcy9jfixc1r',
'160': 'aafdl3chz2tjb',
'161': 'aafdommfn6v9h',
'162': 'aafe2g1cojf8l',
'163': 'aafpu0xswhb0a',
'164': 'aafpych6n6toa',
'165': 'aafpzbmnh62gb',
'166': 'aafqw22kousbj',
'167': 'aafx1rdmi9hz',
'168': 'aag1fw7fdsvgq',
'169': 'aag2bdxb1zzod',
'170': 'aag6yrml80p1',
'171': 'aagdgixo9h4il',
'172': 'aagi4opo4i4i7',
'173': 'aagj5lzrtok1l',
'174': 'aagk3rplp2oq',
'175': 'aagkfcsm98aq',
'176': 'aagksgymb7j25',
'177': 'aagvf8pthsv9j',
'178': 'aagynzrx4lw6t',
'179': 'aah0z2265mu27',
'180': 'aah5rb0nchvc',
'181': 'aah796okx4ktt',
'182': 'aahcap8ane1j',
'183': 'aahddm0pj0kzf',
'184': 'aahk5il3vs8nb',
'185': 'aahkomybdy9cq',
'186': 'aahtyhxql3gdv',
'187': 'aahu616luoqk',
'188': 'aahzktutg9h0k',
'189': 'aai49tio3jr1',
'190': 'aai4gnvz75elf',
'191': 'aaidr7c6vvvdg',
'192': 'aaie3l5mblwr8',
'193': 'aaircxzw432dl',
'194': 'aait3lw67i0p',
'195': 'aaj1xm0vq7i2e',
'196': 'aaj23mxmhem6',
'197': 'aaj6poat2t5us',
'198': 'aajkkwr6mmkvm',
'199': 'aajkr3bl6rvn',
'200': 'aajrcbl6ppmq',
'201': 'aajxh5p8qd07b',
'202': 'aak1014diu9o',
'203': 'aak1ibztjkbor',
'204': 'aak2lvev6by2c',
'205': 'aak4yzupgv1ep',
'206': 'aak57khihyhhs',
'207': 'aak7oj2lgjjf',
'208': 'aakenu9g77hsb',
'209': 'aakkbgs6p53kr',
'210': 'aakmodway7brb',
'211': 'aako0d5mmneir',
'212': 'aakpnogzuk3vc',
'213': 'aakqw4ag048us',
'214': 'aal1v76telu7',
'215': 'aalcfegnvd7m',
'216': 'aalgelfn3dq3',
'217': 'aalib3h4hccm',
'218': 'aalioqq8mk1b',
'219': 'aaljsgyvikwp9',
'220': 'aalsiv1ah972',
'221': 'aalv6qzqhwwp',
'222': 'aam5pxqkku2f',
'223': 'aam5upuoh3nhk',
'224': 'aam60kv3nzj9',
'225': 'aam941evf4pt',
'226': 'aam94781023t',
'227': 'aam9a9f1gmew',
'228': 'aam9yj4f5o1iq',
'229': 'aamchd5sj610m',
'230': 'aamgjpfm5sknj',
'231': 'aamk216hmpp3m',
'232': 'aamks9stu1sck',
'233': 'aamnleovgohx',
'234': 'aampe1ksr52h9',
'235': 'aamr3hcb7tq2',
'236': 'aamwgmey1ng5o',
'237': 'aan0wi8v3unrj',
'238': 'aan80v6n5jehk',
'239': 'aan8m0xas9g6b',
'240': 'aanar7hvzual9',
'241': 'aand5qljpmo1a',
'242': 'aangxoa905ipq',
'243': 'aanj3aijmk9ug',
'244': 'aannztobc5x9',
'245': 'aanrv350v9dwe',
'246': 'aansi7dqnven',
'247': 'aanu9emrwoxgo',
'248': 'aanycl4x65jj',
'249': 'aao0iuifiii7',
'250': 'aao3zdnvq1gb',
'251': 'aao829h5xke6',
'252': 'aaobxvkyyycu',
'253': 'aaodn8hpp9pkk',
'254': 'aaoj6940nrgp',
'255': 'aaoltkjqft1a',
'256': 'aaozsy3vjvpcb',
'257': 'aap0oblc3f2hl',
'258': 'aap1cogbdg2u9',
'259': 'aap3mqrslbae',
'260': 'aap51kn84bz7c',
'261': 'aap5a1779fjhh',
'262': 'aap7oexpqsi0o',
'263': 'aapaa0wwj1t9b',
'264': 'aapc9racq4u',
'265': 'aapeo5ya1rgn',
'266': 'aaphmm7v3dhcm',
'267': 'aapish3ilrqy',
'268': 'aapm70rap26u',
'269': 'aapn3m8v5i6hc',
'270': 'aapnf1lwvn0g',
'271': 'aapr28cxgoo6',
'272': 'aaq3ggkibe57',
'273': 'aaq46dva4f7w',
'274': 'aaq6c53tmjnz',
'275': 'aaq7x3fj6zijm',
'276': 'aaqdxt0b8tlna',
'277': 'aaqqcjjjr60v9',
'278': 'aaqu89jv1ujbt',
'279': 'aar4jiqb4lcx',
'280': 'aar77lxbncn1n',
'281': 'aar7l80v2gia',
'282': 'aar7rruk9huge',
'283': 'aareu44w4c7w',
'284': 'aarklvghav6yj',
'285': 'aarposerznnl',
'286': 'aaruy1ze8iyi8',
'287': 'aarvpr62om8yh',
'288': 'aarx2v2v0f9u8',
'289': 'aas1t5iwfa62k',
'290': 'aas6e5fzqoydq',
'291': 'aasce3mp1ic0h',
'292': 'aascrkjibsk8',
'293': 'aasm3rd7kbv9',
'294': 'aasoc8aoijhe',
'295': 'aassesulkwanc',
'296': 'aasw39wuqbjge',
'297': 'aat55lub5cfl',
'298': 'aat5wae1nwkh8',
'299': 'aat8u5ncrte6o',
'300': 'aathccrnh4jsh',
'301': 'aathf4is0qt58',
'302': 'aatka0j4317qa',
'303': 'aatrqqoqzkhzb',
'304': 'aau3knwafn2ba',
'305': 'aauc1lc39gmla',
'306': 'aaukgxfq8um8c',
'307': 'aautvt2cy2o3',
'308': 'aauty43mr03wl',
'309': 'aav33ocxb0iq',
'310': 'aav5rordr8b7f',
'311': 'aavh7e4bkb29f',
'312': 'aavs3x7grf1j',
'313': 'aavyygx6bstj8',
'314': 'aaw1wa6dtvt2o',
'315': 'aaw4i1xcqiwyd',
'316': 'aaw55b4ku66jd',
'317': 'aaw685pis07c',
'318': 'aaw6hmopvuhf',
'319': 'aawh56fen1e6p',
'320': 'aawlkabi6g4r',
'321': 'aawqpiy9pobh',
'322': 'aawug9whn6p1r',
'323': 'aawzvd2e3lcoi',
'324': 'aax1fff2qqe08',
'325': 'aax1w70e5kv8',
'326': 'aax5d51sa8o',
'327': 'aaxakr8eep6g',
'328': 'aaxemvcc1x1s',
'329': 'aaxsjdzcrnd4',
'330': 'aaxvl1xltbd7',
'331': 'aaxyonkwg8qv',
'332': 'aay23asc9wq6',
'333': 'aay2fkvd6amka',
'334': 'aay5ej274l39n',
'335': 'aay6j7ujxjgmg',
'336': 'aay6kqsy6wygf',
'337': 'aay7kpf59x4z',
'338': 'aaya3fo44dtd',
'339': 'aayaiwhjmyje',
'340': 'aaybe2nv2uhw9',
'341': 'aaybuq4n7gyj',
'342': 'aayduq8t6ecuo',
'343': 'aayl7phxyjnqf',
'344': 'aaylkaogom6o8',
'345': 'aayn5cq1t6axa',
'346': 'aayrctvmq4p5',
'347': 'aayvupzcd07s8',
'348': 'aayxtcuyibbj',
'349': 'aayxy9ymlar5h',
'350': 'aayz9zp79tiq',
'351': 'aayzpxjo78c3f',
'352': 'aaz0jyeonw24',
'353': 'aaz1yqhqxv8a',
'354': 'aaz7rmx4bf59',
'355': 'aazpzmnp79ekh',
'356': 'aazra5h1r3inn',
'357': 'aazu8sueci89',
'358': 'aazwoo8oozvk',


    }

    var display_names_to_task = []; // or var revMap = {};
    Object.keys(map_to_display_names).forEach(function(key) { 
        display_names_to_task[map_to_display_names[key]] = key;   
    });

    var VALID_TARGETS = [];
    // [
    //     'Autoencoding', 'Curvature', 'Scene Class.', 'Denoising', '2D Edges', 'Occlusion Edges',
    //     '2D Keypoints', '3D Keypoints', 'Reshading', 'Z-Depth', 'Distance', 'Normals', 'Layout',
    //     '2.5D Segm.', '2D Segm.', 'Vanishing Pts.', 'Semantic Segm.',  'Object Class. (1000)', 
    //     'Colorization', 'Jigsaw', 'In-painting'
    // ]
    var sortOrder_old = [
        'rgb2sfnorm',
        'reshade',
        'rgb2depth',
        'rgb2sfnormb',
        'reshadeb',
        'rgb2depthb',
        'curvature_consistency',
        'edge2d_consistency',
        'edge3d_consistency',
        'curvature_baseline',
        'edge2d_baseline',
        'edge3d_baseline',
        'keypoint2d_consistency',
        'keypoint3d_consistency',
        'keypoint2d_baseline',
        'keypoint3d_baseline',

        ];

    var sortOrder = [
        'rgb2sfnorm',
        'reshade',
        'rgb2depth',
        'curvature_consistency',
        'edge2d_consistency',
        'edge3d_consistency',
        'keypoint2d_consistency',
        'keypoint3d_consistency',
        'energy_2d1',

        'rgb2sfnorm1',
        'rgb2sfnormb',
        'rgb2normal_cycle',
        'rgb2normal_geonet',
        'rgb2normal_taskonomy',
        'rgb2normal_multitask',

        'reshade1',
        'reshadeb',
        'rgb2reshading_taskonomy',
        'rgb2reshading_multitask',
  
        'rgb2depth1',
        'rgb2depthb',
        'rgb2depth_geonet',
        'rgb2depth_taskonomy',
        'rgb2depth_multitask',
        
        
        'energy_2d',
        'energy_dist',
        'energy',
        'kenburns',
        ];


    for (var i in sortOrder){
        VALID_TARGETS.push(map_to_display_names[sortOrder[i]]);
    }

    var getToken = function() {
        return "aa" + Math.random().toString(36).substr(2); // remove `0.`
    };

    document.getElementById("uploadToken").value = getToken();

    var source_exists = false;
    var all_videos = [];

    var clearDemo = function(){
        document.getElementById("output-section").innerHTML = "";        
        // document.getElementById("our-vids").innerHTML = "";
        // document.getElementById("alex-vids").innerHTML = "";
        // document.getElementById("scratch-vids").innerHTML = "";
        all_videos = [];
        source_exists = false;
    };
    $('#clearDemo').on("click", clearDemo);


    var loaderHTML = `
    <div class="spinner"></div>`;

    var makeImageFrame = function(title, ensureSameSize) {
        var imageHolder = document.createElement("div");
        imageHolder.classList.add('col-xs-12');
        imageHolder.classList.add('col-sm-6');
        imageHolder.classList.add('col-lg-4');
        // imageHolder.classList.add('col-xs-' + cols.toString());
        imageHolder.classList.add('no-pad');
        imageHolder.classList.add('image-holder');

        if ((title=='Baseline U-Net Normals') || (title=='Baseline U-Net Depth') || (title=='Baseline U-Net Reshading')){
            title = 'Baseline U-Net';
        }

        if ((title=='Consistency Normals') || (title=='Consistency Depth') || (title=='Consistency Reshading')){
            title = 'Consistency';
        }

        if ((title=='GeoNet Baseline Normals') || (title=='GeoNet Baseline Depth')){
            title = 'GeoNet Baseline';
        }

        if ((title=='Multitask Baseline Normals') || (title=='Multitask Baseline Depth')  ||  (title=='Multitask Baseline Reshading')){
            title = 'Multitask Baseline';
        }

        if ((title=='Taskonomy Baseline Normals') || (title=='Taskonomy Baseline Depth')  ||  (title=='Taskonomy Baseline Reshading')){
            title = 'Taskonomy Baseline';
        }

        var titleElem = document.createElement("div");
        titleElem.innerHTML = "<h4 style='word-wrap: break-word;padding-bottom: 5px;margin-bottom: 0px'>" + title + "</h4>";

        var loader = document.createElement("div");
        loader.innerHTML = loaderHTML;
        //if (title=='From Consistency Depth'){
        //
        //  loader.innerHTML = '<video muted playsinline preload="metadata" width=100%' + ' height=100%' + ' style="background-color:#ddd" class=' + 'hi' + ' loop >' + '</video>'
        //}

        if (ensureSameSize) {
            titleElem.classList.add('returnedImageTitle');
            imageHolder.classList.add('returnedImage');
        }
        
        imageHolder.appendChild(titleElem);
        imageHolder.appendChild(loader);
        return [imageHolder];
    }


   var makeVideoFrame = function(title, vid_name) {
        var videoHolder = document.createElement("div");
        videoHolder.classList.add('col-xs-12');
        videoHolder.classList.add('col-sm-6');
        videoHolder.classList.add('col-lg-4');
        // imageHolder.classList.add('col-xs-' + cols.toString());
        videoHolder.classList.add('no-pad');
      
      
        var titleElem = document.createElement("div");
        titleElem.innerHTML = "<h4 style='word-wrap: break-word;padding-bottom: 5px;margin-bottom: 0px'>" + title + "</h4>";

        //alert(vid_name);
        var cls = "hi";
        var vid = document.createElement("div");


        vid.innerHTML = '<video muted playsinline preload="metadata" crossorigin="anonymous" width=100%' + 
            ' height=100%' + 
            ' style="background-color:#ddd" class=' + cls + 
            ' loop >' +
            '<source src="' + vid_name + '" type="video/mp4">' +
            //'<source src="https://s3.us-west-2.amazonaws.com/task-preprocessing-512-oregon/video_short/' + vid_name + '" type="video/webm">' +
            //'<source src="https://s3.us-west-2.amazonaws.com/task-preprocessing-512-oregon/video_short_mp4/' + vid_name.replace('webm', 'mp4') + '" type="video/mp4">' +
            'Video not found.</video>';

        
        videoHolder.appendChild(titleElem);
        videoHolder.appendChild(vid);
       
        return [videoHolder, vid];
    }


    var ensureSameSize = function(className){
        var boxes = $('.' + className);
        var maxHeight = Math.max.apply(
          Math, boxes.map(function() {
            return $(this).outerHeight();
        }).get());
        // boxes.height(maxHeight);
        //alert(maxHeight);
        if (maxHeight==62){
        maxHeight = 40; // I manually set this 
        }
        boxes.css('height', maxHeight);        
        return maxHeight;
    };

    var resizeMinHeight = function(className) {
        var boxes = $('.' + className);
        boxes.css('height', "");        
        ensureSameSize(className);
    }

    var all_videos = [];
    var play_all = function(vids) {



            vids.forEach( function(vid) {
                vid = vid.children[0];
                vid.play();
            });

        };

    var updateImageFrame = function(imageHolder, image_uri, crop) {    
        imageHolder.children[1].remove();
        var containerDiv = document.createElement("div");
        if (crop) {
            containerDiv.className = 'thumbnail2';
        }

        var choice = image_uri[image_uri.length-1];
    
        var oImg = document.createElement("img");
        if (choice=='4'){
        var oImg = document.createElement("video");
            //oImg.innerHTML = '<video muted playsinline preload="metadata" crossorigin="anonymous" width=100%' + 
            //' height=100%' + 
            //' style="background-color:#ddd" class=' + 'hi' + 
            //' loop >' +
            ////'<source src="https://s3.us-west-2.amazonaws.com/task-preprocessing-512-oregon/video_short/' + vid_name + '" type="video/webm">' +
            ////'<source src="https://s3.us-west-2.amazonaws.com/task-preprocessing-512-oregon/video_short_mp4/' + vid_name.replace('webm', 'mp4') + '" type="video/mp4">' +
            //'</video>';

            oImg.setAttribute('playsinline', 'True');
            oImg.setAttribute('muted', 'True');
            oImg.setAttribute('autoplay', 'True');
            //oImg.classList.add('playsinline');
            //oImg.classList.add('muted');
            //oImg.classList.add('autoplay');
            oImg.setAttribute('height', '100%');
            oImg.setAttribute('width', '100%')
            oImg.onload = function() {
                ensureSameSize('returnedImageTitle');
                resizeMinHeight('returnedImage');
            }
            oImg.setAttribute('crossorigin', "anonymous");
            oImg.setAttribute('src', image_uri);
            oImg.setAttribute('loop', 'True');
            //oImg.play();
            //all_videos.push(oImg);
            //play_all(all_videos);
        }
        else{
        oImg.setAttribute('alt', 'na');
        if (!crop){
            oImg.setAttribute('height', '100%');
            oImg.setAttribute('width', '100%')
            oImg.onload = function() {
                ensureSameSize('returnedImageTitle');
                resizeMinHeight('returnedImage');
            }

        }
        else {
            oImg.onload = function() {
                oImg.className = oImg.width > oImg.height ? '' : 'portrait';                
            }
        }
        oImg.setAttribute('crossorigin', "anonymous");
        oImg.setAttribute('src', image_uri);  

        }      
        containerDiv.appendChild(oImg);
        imageHolder.appendChild(containerDiv);
       
        return [imageHolder, oImg];
    }

    var loadFile = function(event) {
        var fileSizeInMB = $('#imageUploadInput')[0].files[0].size/1024/1024;
        if (fileSizeInMB > 10.0) {
            alert('Please ensure upload is < 10MB. The current image size is: ' + fileSizeInMB.toFixed(2) + "MB.");
            document.getElementById("imageUploadInput").value = '';
            return;
        }

        document.getElementById("uploadToken").value = getToken();
        var image_uri = URL.createObjectURL(event.target.files[0])
        //showSourceImage(image_uri);
       
        if (fileSizeInMB > 10.5) {
        //alert('downsampling');
        //alert(resizedataURL(image_uri, 512, 512));
        var imgss = resizedataURL(image_uri, 512, 512);
        //alert(imgss.src);

        //var imgss = new Image();
        //var imgss2 = new Image();
        //imgss.onload=start;
        //imgss.src = image_uri;
        //imgss.onload=start;
        //var canvas = document.createElement('canvas');
        //var ctx = canvas.getContext('2d');
        //imgss.onload=start;
        //function start(callback){

         // We set the dimensions at the wanted size.
        //        canvas.width = 512;
        //        canvas.height = 512;
        //        ctx.drawImage(imgss, 0, 0, 512, 512);
        //        var dataURI = canvas.toDataURL();
        //        var blob = dataURLtoBlob(dataURI);
        //        var curr_uri = URL.createObjectURL(blob);
        //        image_uri = curr_uri;
                
        //}
        //alert(imgss2.src);
       
        image_uri = imgss;
        //alert(event.target.files[0]);
        //alert(event.target.files[0].value);
        //alert(event.target.files);
        //alert(event.target.files.value);
        //alert($('#imageUploadInput').value);
        //alert($('#imageUploadInput')[0].value);
        //alert($('#imageUploadInput')[0].files[0].value);
        //alert($('#imageUploadInput')[0].files[0]);
        //document.getElementById("imageUploadInput")[0].src=image_uri;
        //alert(document.getElementById("imageUploadInput"));
        //alert(aaa);
        //alert(aaa.value);
        //alert(aaa.src);

        //var img_fin = document.getElementById("imageUploadInput");
        //img_fin.src = image_uri;

        var form = document.getElementById("uploadForm");
        alert(form.value);
        alert(form.imageUploadInput);
        alert(form.imageUploadInput.value);
        //form.imageUploadInput.value = '';
        alert(form.imageUploadInput.value);
        form.imageUploadInput = image_uri;
        //form.append("file", image_uri, "file");
        alert(form.imageUploadInput);
        alert(form.imageUploadInput.value);

        var data = new FormData();
        data.append("file", image_uri, "file");

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://storage.googleapis.com/task-demo-results', true);
        xhr.send(data);        
        alert('sent');
        }

        //alert(imgss);      
      
        //alert(image_uri);
        showSourceImage(image_uri);

        //alert($('#imageUploadInput').value);
        //alert($('#imageUploadInput')[0].value);
        //alert($('#imageUploadInput')[0].files[0].value);
        //alert($('#imageUploadInput')[0].files[0]);
 
    };


    // Takes a data URI and returns the Data URI corresponding to the resized image at the wanted size.
function resizedataURL(datas, wantedWidth, wantedHeight){
        return new Promise(async function(resolve,reject){
        
        // We create an image to receive the Data URI
        var imgss = document.createElement('img');

        // When the event "onload" is triggered we can resize the image.
          imgss.onload = function()
               {        
                
                // We create a canvas and get its context.
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');

                // We set the dimensions at the wanted size.
                canvas.width = wantedWidth;
                canvas.height = wantedHeight;
                

                // We resize the image with the canvas method drawImage();
                ctx.drawImage(this, 0, 0, wantedWidth, wantedHeight);

                var dataURI = canvas.toDataURL();
          
                var blob = dataURLtoBlob(dataURI);
                var curr_uri = URL.createObjectURL(blob);
                //alert(curr_uri);
                //return curr_uri;
                resolve(curr_uri);
                
                /////////////////////////////////////////
                // Use and treat your Data URI here !! //
                /////////////////////////////////////////
            };

        
        // We put the Data URI in the image's src attribute
        imgss.src = datas;
        //return imgss;
        //alert(img.src);
        //alert('hey');
        //return curr_uri;
        
       })
    }
// Use it like that : resizedataURL('yourDataURIHere', 50, 50);

    function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }

  
    return new Blob([u8arr], {type:mime});
     }

    var showSourceImage = function(image_uri) {
        clearDemo();
        document.getElementById("source-section").innerHTML = ""; 
        var imFrame = makeImageFrame("Input Image", false);        
        imFrame = updateImageFrame(imFrame[0], image_uri, true);        
        imFrame[0].classList.remove('col-sm-6');
        imFrame[0].classList.remove('col-med-6');
        imFrame[0].classList.remove('col-lg-4');
        //document.getElementById("source-section").setAttribute("data-spy", "affix");
        //document.getElementById("source-section").setAttribute("data-offset-top", "01");
        document.getElementById("source-section").appendChild(imFrame[0]);
    }

    $('#imageUploadInput').on("change", loadFile);


    $('#formResponse').on("change", function(event){
        console.log(event);
    });

    
    var setIntervalWithMaxAttempts = function(callback, interval, maxAttempts) {
        var intervalId = null;
        var counter = 0;
        var wrappedCallback = function(){
            if (maxAttempts != null && counter < maxAttempts) {
                clearInterval(intervalId);
                return;
            }
            counter += 1;
            callback();
        }

        intervalId = setInterval(callback, 1000);        
    };


    var intervals = []
    var num_on_row = 0;
    var getResponseURLs = function(uploadtoken, task, callback){    
        

        if (display_names_to_task[task]=='kenburns'){
        var imFrame = makeVideoFrame(task, 'https://storage.googleapis.com/task-demo-results/predictions/' +uploadtoken+ '__kenburns.mp4');
        }
        else {        
        var imFrame = makeImageFrame(task, true);
        }
        document.getElementById("output-section").appendChild(imFrame[0]);
        
        num_on_row += 1;
        // if (num_on_row * 4 >= 12) {
        //     num_on_row = 0;
        //     var newRow = document.createElement("div");
        //     newRow.className = 'row';
        //     document.getElementById("output-section").appendChild(newRow);
        // }

        var curr_task = display_names_to_task[task]+'.png';

        if (curr_task=='kenburns.png'){
           curr_task='kenburns.mp4';
        }

       
        if (curr_task=='rgb2sfnorm1.png'){
            curr_task='rgb2sfnorm.png';
        }
        if (curr_task=='reshade1.png'){
            curr_task='reshade.png';
        }
        if (curr_task=='rgb2depth1.png'){
            curr_task='rgb2depth.png';
        }
        if (curr_task=='energy_2d1.png'){
            curr_task='energy_2d.png';
        }


        var checkTaskIntervalId = null;        
        var checkTaskCounter = 0;
        var maxCheckTaskAttempts = 480
        var checkTask = function(){
            if (checkTaskCounter >= maxCheckTaskAttempts) {
                clearInterval(checkTaskIntervalId);
                return;
            }
            checkTaskCounter += 1;

            // Code to execute
            var xhr = new XMLHttpRequest();
        
            var imageUri = encodeURI(
                "https://storage.googleapis.com/task-demo-results/predictions/" + uploadtoken + "__" + curr_task);

           
            //xhr.onload = function () {
            //    // Request finished. Do processing here.
            //    var rawResponse = xhr.responseText; // truncated for example
    
            //     // convert to Base64
            //     var b64Response = btoa(unescape(encodeURIComponent(rawResponse)));
                
            //     // create an image
            //      outputImg.src = 'data:image/png;base64,'+b64Response;
                
            //     // append it to your page
            //     document.body.appendChild(outputImg);
            //     console.log(imageUri);
            //     callback(task, imFrame, imageUri);   
            //     console.log("response", xhr.responseText);         
            //     clearInterval(checkTaskIntervalId);                
            // };
            
            xhr.ontimeout = function (e) {
                    console.log(task + ' stalled');
            };

            xhr.onreadystatechange = function() {
                if(xhr.readyState == 4 && xhr.status == 200) {
                    // console.log(imageUri);
                    callback(task, imFrame, imageUri);   
                    // console.log("response", xhr.responseText);  
                    clearInterval(checkTaskIntervalId);
                    intervals.pop(intervals.indexOf(checkTaskIntervalId), 1); //Remove
                } 
                else {
                    // console.log("404:", checkTaskCounter,  Date.now());                    
                }
            };
            xhr.open(
                'HEAD', 
                encodeURI(
                    "https://storage.googleapis.com/task-demo-results/predictions/" + uploadtoken + "__" + curr_task ),
                true);
            xhr.timeout = 3000;
            xhr.send();

          
        };
        console.log(encodeURI(
            "https://storage.googleapis.com/task-demo-results/predictions/" + uploadtoken + "__" + curr_task));
        // checkTask();
        checkTaskIntervalId = setInterval(checkTask, 3000);
        intervals.push(checkTaskIntervalId);
            // xhr.onreadystatechange = function()
            // {
            //     if(xhr.readyState == 4 && xhr.status == 200) {
            //         callback(task, imFrame, xhr.responseText);
            //     } else {
            //         console.log(task + ' failed');
            //     }
            // }
            // xhr.send(null);
    };


    var formValid = function() {
        var imageUploadInput = document.getElementById("imageUploadInput");
        var uploadToken = document.getElementById("uploadToken").value;
        var isSample = false;
        $(".sample-img").each(function() { 
            if (this.id == uploadToken) {
                isSample = true;
            }
            else {
                console.log(this.id, uploadToken);
            }
        } );
        console.log((isSample || imageUploadInput.value != "") && grecaptcha.getResponse().length > 0    );
        return (isSample || imageUploadInput.value != "") && grecaptcha.getResponse().length > 0

    };


    var makeRowTitle = function(title) {
     
        var folderName = title == "Source" ? 'video_short' : 'video_short';
        var videoHolder = document.createElement("div");
        videoHolder.classList.add('col-xs-12');
        // videoHolder.classList.add('no-pad');

        var bb = videoHolder.getBoundingClientRect();
        var width = bb.right - bb.left;


        // var titleElem = document.createElement("div");
        // videoHolder.innerHTML = "<h4 style='float:right; transform: translateX(-100%) rotate(-90deg) ;'>" + title + "</h4>";
        videoHolder.innerHTML = "<h3 style='text-align:center;    text-decoration: underline; '>" + title + "</h3>";
        if (title=="3D Ken Burns"){//append link 
        videoHolder.innerHTML = "<h3 style='text-align:center;    text-decoration: underline; '>" + 
        "<div class=involved-share> <p class=hover>3D Ken Burns*</p> <p class=hover-other>Using Niklaus et al. 2019 3D Ken Burns method and depth predicted by the consistency-based model</p> </div> </h3> ";
        }
        // videoHolder.appendChild(titleElem);
        return videoHolder;
    }

    $('#submitDemo').on("click",function() {
        if (!formValid()){
            return;
        }
        document.getElementById("output-section").innerHTML = ""; 
        var uploadtoken = document.getElementById("uploadToken").value;
        // var selectedTasks = $("#targetpicker").val()

        //var titleElem = makeRowTitle("Consistency-based Learning Prediction Results");
        //document.getElementById("output-section").appendChild(titleElem);

        for (var t in VALID_TARGETS) {
            var task = VALID_TARGETS[t];
            if (task == 'Normals') {
                var titleElem = makeRowTitle("Consistency-based Learning Prediction Results");
                document.getElementById("output-section").appendChild(titleElem);    
            } 
            // Make the api call here...
            getResponseURLs(uploadtoken, task, function(taskname, imFrame, image_uri){
                // var imFrame = makeImageFrame(taskname, 4);
                imFrame = updateImageFrame(imFrame[0], image_uri, false);
            });
            // break;

           if (task=='Uncertainty (Energy)')  {

            var titleElem = makeRowTitle("Consistency-based Learning vs Baselines (Normals)");
        document.getElementById("output-section").appendChild(titleElem);


           }


           if (task=='Multitask Baseline Normals'){

            var titleElem = makeRowTitle("Consistency-based Learning vs Baselines (Reshading)");
        document.getElementById("output-section").appendChild(titleElem);

           }



           if (task=='Multitask Baseline Reshading') {

            var titleElem = makeRowTitle("Consistency-based Learning vs Baselines (Depth)");
        document.getElementById("output-section").appendChild(titleElem);


           } 

         if (task=='Multitask Baseline Depth') {

            var titleElem = makeRowTitle("Consistency Energy");
       document.getElementById("output-section").appendChild(titleElem);


           }

       if (task=='Energy vs Error Scatterplot') {

            var titleElem = makeRowTitle("3D Ken Burns");
       document.getElementById("output-section").appendChild(titleElem);


           }



        }
    });

    $('#uploadForm').on("submit",function() {
        if (!formValid()){
            return;
        }
        document.getElementById("imageUploadInput").style = "display:none";;        
        document.getElementById("imageUploadInputLabel").style = "display:none";;        
        
      
        document.getElementById("submitDemo").disabled=true;
        document.getElementById("submitDemo").value="refresh to upload new image";
    });
    

    $('.sample-img').each(function() {
        $( this ).on("click", function() {
            document.getElementById("uploadToken").value = this.id;
            $('.sample-img').each(function() {
                if (this.id == document.getElementById("uploadToken").value) {
                    this.classList.add('selected');
                }
                else {
                    this.classList.remove('selected');
                }
            });
            //showSourceImage(this.src);

            //var pick_random = random_queries[Math.floor(Math.random()*2)];
            
           

            //var titleElem = makeRowTitle("Consistency-based Learning Prediction Results");
            //document.getElementById("output-section").appendChild(titleElem);
            

            var uploadtoken = document.getElementById("uploadToken").value;
            if (this.id=='random'){
            var uploadtoken = random_queries[Math.floor(Math.random()*359)];
            this.src_new = "https://storage.googleapis.com/task-demo-results/predictions/" + uploadtoken + ".png"
            showSourceImage(this.src_new);
            }
            else{
            showSourceImage(this.src);
            }
            
            for (var t in VALID_TARGETS) {
                var task = VALID_TARGETS[t];
                if (task == 'Normals') {
                var titleElem = makeRowTitle("Consistency-based Learning Prediction Results");
                document.getElementById("output-section").appendChild(titleElem); 
             
                }
                // Make the api call here...
                getResponseURLs(uploadtoken, task, function(taskname, imFrame, image_uri){
                    // var imFrame = makeImageFrame(taskname, 4);
                    imFrame = updateImageFrame(imFrame[0], image_uri, false);
                });
                // break;
 
            
              if (task=='Uncertainty (Energy)')  {

            var titleElem = makeRowTitle("Consistency-based Learning vs Baselines (Normals)");
        document.getElementById("output-section").appendChild(titleElem);


           }


           if (task=='Multitask Baseline Normals'){

            var titleElem = makeRowTitle("Consistency-based Learning vs Baselines (Reshading)");
        document.getElementById("output-section").appendChild(titleElem);

           }



           if (task=='Multitask Baseline Reshading') {

            var titleElem = makeRowTitle("Consistency-based Learning vs Baselines (Depth)");
        document.getElementById("output-section").appendChild(titleElem);


           } 

          if (task=='Multitask Baseline Depth') {

            var titleElem = makeRowTitle("Consistency Energy");
            document.getElementById("output-section").appendChild(titleElem);


           }


          if (task=='Energy vs Error Scatterplot') {

            var titleElem = makeRowTitle("3D Ken Burns");
       document.getElementById("output-section").appendChild(titleElem);


           }


            }
        });
    });

    $( document ).ready (
        function () {
            $('#sample4').click();

            ensureSameSize('returnedImageTitle');
            $( window ).resize(function() {
                resizeMinHeight('returnedImageTitle');
                resizeMinHeight('returnedImage');
            });
        }
    );
})(jQuery);


