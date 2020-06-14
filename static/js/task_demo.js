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
'8': 'aa0mghsq8jj68',
'9': 'aa0n40n7olrulo',
'10': 'aa0t62ldpvy9ra',
'11': 'aa0v9xax1660kg',
'12': 'aa0wd5du2yt8hh',
'13': 'aa10x85xz4w8wj',
'14': 'aa146a3t7km82c',
'15': 'aa17m2y942my5',
'16': 'aa198704uvq4s',
'17': 'aa19zcialqdw3',
'18': 'aa1srcf11fdv9',
'19': 'aa1vlaf40r68d',
'20': 'aa1w2x5rxfi37',
'21': 'aa1xemnzcv9jg',
'22': 'aa20aokiyhwlw',
'23': 'aa22n4dt1p238',
'24': 'aa2346er4rvlr',
'25': 'aa26m4iit8f9j',
'26': 'aa2b9k4vobw9b',
'27': 'aa2bswo5h1wcu',
'28': 'aa2ft2jpvso5j',
'29': 'aa2hwxz7hj0s',
'30': 'aa2k7bd2ex9dn',
'31': 'aa2t7oytqqx78',
'32': 'aa2tx6pt8tvkx',
'33': 'aa2uf3rbx2viy',
'34': 'aa2w3yumz568u',
'35': 'aa2x44wx287ic',
'36': 'aa30coa24l3pf',
'37': 'aa32zvndz8087',
'38': 'aa334xcnqdw1t',
'39': 'aa37gyqu228w4',
'40': 'aa38gxm741mog',
'41': 'aa3bzztkkjcya',
'42': 'aa3ggcy5bpa6f',
'43': 'aa3hbhji4q7d4',
'44': 'aa3jemyfqj8kh',
'45': 'aa3ldc4tzzddr',
'46': 'aa3lykok2d9pr',
'47': 'aa3r24v9dzvh4',
'48': 'aa3sanetx4161',
'49': 'aa3yi6bs0v5yw',
'50': 'aa3zqn4vbmi49',
'51': 'aa40bbfc0pe9',
'52': 'aa44y1i4aifqv',
'53': 'aa47p3e4lx2tw',
'54': 'aa49j3yx1krjb',
'55': 'aa4a2vyowgo4s',
'56': 'aa4hhgstjhc41',
'57': 'aa4itc9sj6ntt',
'58': 'aa4j0z8kdrf2p',
'59': 'aa4ogyiahugaq',
'60': 'aa507ya1u1prj',
'61': 'aa50v1rmpy0fb',
'62': 'aa52a7tmlffyg',
'63': 'aa53x1jv4l2om',
'64': 'aa59nol0luf4n',
'65': 'aa5f8z0jv1tc',
'66': 'aa5gtmlbgyn6',
'67': 'aa5hkk980m1x5',
'68': 'aa5ivv4d5u3ti',
'69': 'aa5jc5xnfolbo',
'70': 'aa5jwl3j0ta4d',
'71': 'aa5lphz4uuq2',
'72': 'aa5me0exy1cub',
'73': 'aa5mic3sjj18c',
'74': 'aa5mk9xlbupy',
'75': 'aa5n0pk71fsek',
'76': 'aa5rf6be30799',
'77': 'aa5ruvb0dqy4',
'78': 'aa5zlzqxi1fts',
'79': 'aa60ufskyyljr',
'80': 'aa60w8xs5ovmx',
'81': 'aa60zkciu9avn',
'82': 'aa630xgo90jjw',
'83': 'aa6anueuyx8bn',
'84': 'aa6cuusfd8us',
'85': 'aa6hoggurekv',
'86': 'aa6ipywqejoxx',
'87': 'aa6jupcw5thc',
'88': 'aa6kg2giq3cv3',
'89': 'aa6la9oa90z2',
'90': 'aa6lhjvrtcal8',
'91': 'aa6lwjbg1uuwc',
'92': 'aa6mqwyom80xb',
'93': 'aa6mu42fz9u3m',
'94': 'aa6nc4lsbdgg6',
'95': 'aa6o8c05e95u',
'96': 'aa6qgecqfeax',
'97': 'aa6waqeqe8rby',
'98': 'aa6xyuqx3rmjg',
'99': 'aa700giet4vw',
'100': 'aa70ygxaki6rw',
'101': 'aa7143peivdpo',
'102': 'aa74px1zif12x',
'103': 'aa7d4cjx4tw2q',
'104': 'aa7fqwmodmm9h',
'105': 'aa7j5ibfhj3js',
'106': 'aa7r12nkfnlkf',
'107': 'aa7r2ztnwaf13',
'108': 'aa7vsaec3c92a',
'109': 'aa7ycj6jmwv8t',
'110': 'aa80c4zsshulp',
'111': 'aa81ijbs7mqem',
'112': 'aa82b53qz3ppc',
'113': 'aa87tmxn6txi9',
'114': 'aa8d97h754e7g',
'115': 'aa8fisxerq72t',
'116': 'aa8frq8y56vbm',
'117': 'aa8gfja967hp9',
'118': 'aa8m9l3sqj9sm',
'119': 'aa8mckxspa5p',
'120': 'aa8myk1f752dl',
'121': 'aa8onyle4ls58',
'122': 'aa8vwqzx48ns',
'123': 'aa91msuh6dysh',
'124': 'aa92bqrm1wcti',
'125': 'aa94lhn4c8mmv',
'126': 'aa96913z7b4ku',
'127': 'aa98w1qxqr2ih',
'128': 'aa9dvhauorleo',
'129': 'aa9iqwnmx9go6',
'130': 'aa9l0np5oupad',
'131': 'aa9ytd6adiet',
'132': 'aaa0ej1gq0y3m',
'133': 'aaa5a7h9uixm7',
'134': 'aaa5c3agirwrc',
'135': 'aaa6l0ydqnehi',
'136': 'aaa6szwmtgs7',
'137': 'aaaao9r6mzoyt',
'138': 'aaabpm4wp7r7t',
'139': 'aaaccvnjq3osb',
'140': 'aaafkrrk7cxqb',
'141': 'aaammgtwlovjo',
'142': 'aaaqh47izjpud',
'143': 'aaasqk1jrm3',
'144': 'aaatxagcrusjj',
'145': 'aaauh4u01rmlj',
'146': 'aaawp9xqtd4c9',
'147': 'aaax68p6o5lel',
'148': 'aaax9tgnkhqe5',
'149': 'aaaxcevftbbiv',
'150': 'aaaz0kb4mzoo',
'151': 'aaazgchb46ek',
'152': 'aab4ooxhudcvr',
'153': 'aab5ibp2g7rpn',
'154': 'aab7220mkd3as',
'155': 'aabkf8wsc5cja',
'156': 'aablzu482ini',
'157': 'aabugwj1693ch',
'158': 'aabvpdwmaar2',
'159': 'aac080o4wrxp7',
'160': 'aac1hmgixftf9',
'161': 'aacasxlym0rhb',
'162': 'aacatxp6qypsj',
'163': 'aaccddrq7cjn7',
'164': 'aaccf1rf03oj8',
'165': 'aacd4t8nu7hmo',
'166': 'aacmf7622j1mt',
'167': 'aacnfcf00889a',
'168': 'aacnw38du3g1q',
'169': 'aacqudzxhr0y',
'170': 'aacr6c2kv4txt',
'171': 'aacrgxbzf9ivu',
'172': 'aactvo95b7399',
'173': 'aacu609yqxujm',
'174': 'aacwe8pf8afa4',
'175': 'aacxmyy5iar5',
'176': 'aacxvff5zu5f',
'177': 'aacyhywbsid8h',
'178': 'aaczm30bry34a',
'179': 'aaczth0mbn3y7',
'180': 'aad22etkql6wt',
'181': 'aad82q7in48e',
'182': 'aadjnrxuggcml',
'183': 'aadpt67uz4jn',
'184': 'aadq0tyhh00z8',
'185': 'aadrmax5ye7il',
'186': 'aadsnbwu376xe',
'187': 'aaduaxwxyflc',
'188': 'aaduockyx30v',
'189': 'aadwzp89kahnn',
'190': 'aadxfwzfjr8vm',
'191': 'aae67bw5gb5fu',
'192': 'aaef90e283ugb',
'193': 'aaefifoeip5z',
'194': 'aaeg1u1ugmdew',
'195': 'aaekb12le999c',
'196': 'aaem2pjgb5ty8',
'197': 'aaenxpv9fsuss',
'198': 'aaeq1gppqkn9u',
'199': 'aaeqx5wywcbs',
'200': 'aaeuu14nyo8ro',
'201': 'aaf9xo6ephhin',
'202': 'aafb362zbcxf7',
'203': 'aafcy9jfixc1r',
'204': 'aafdl3chz2tjb',
'205': 'aafdommfn6v9h',
'206': 'aafe2g1cojf8l',
'207': 'aafj36jb8ah0k',
'208': 'aafpu0xswhb0a',
'209': 'aafpych6n6toa',
'210': 'aafpzbmnh62gb',
'211': 'aafqw22kousbj',
'212': 'aafqx6njdd2y4',
'213': 'aafvm7jaaxwoi',
'214': 'aafwdi7s2i496',
'215': 'aafx1rdmi9hz',
'216': 'aag1fw7fdsvgq',
'217': 'aag2bdxb1zzod',
'218': 'aag6yrml80p1',
'219': 'aagdgixo9h4il',
'220': 'aagf9oso1fimp',
'221': 'aagi4opo4i4i7',
'222': 'aagj5lzrtok1l',
'223': 'aagk3rplp2oq',
'224': 'aagkfcsm98aq',
'225': 'aagkoac73qwch',
'226': 'aagksgymb7j25',
'227': 'aagvf8pthsv9j',
'228': 'aagynzrx4lw6t',
'229': 'aah0z2265mu27',
'230': 'aah5rb0nchvc',
'231': 'aah796okx4ktt',
'232': 'aahcap8ane1j',
'233': 'aahddm0pj0kzf',
'234': 'aahiqmv4b3329',
'235': 'aahk5il3vs8nb',
'236': 'aahkomybdy9cq',
'237': 'aahozwjvt8via',
'238': 'aahtyhxql3gdv',
'239': 'aahu616luoqk',
'240': 'aahzktutg9h0k',
'241': 'aai49tio3jr1',
'242': 'aai4gnvz75elf',
'243': 'aaidr7c6vvvdg',
'244': 'aaie3l5mblwr8',
'245': 'aaio1v7dbodif',
'246': 'aaircxzw432dl',
'247': 'aais6zylwbyui',
'248': 'aait3lw67i0p',
'249': 'aaj1xm0vq7i2e',
'250': 'aaj23mxmhem6',
'251': 'aaj6poat2t5us',
'252': 'aajipcg3q95xm',
'253': 'aajkkwr6mmkvm',
'254': 'aajkr3bl6rvn',
'255': 'aajktzamprlnc',
'256': 'aajme9m71zab',
'257': 'aajrcbl6ppmq',
'258': 'aajxh5p8qd07b',
'259': 'aak1014diu9o',
'260': 'aak1ibztjkbor',
'261': 'aak2lvev6by2c',
'262': 'aak4yzupgv1ep',
'263': 'aak57khihyhhs',
'264': 'aak7oj2lgjjf',
'265': 'aakc1dt6b6qq',
'266': 'aakeksfgvvrkm',
'267': 'aakenu9g77hsb',
'268': 'aakjppm2e5dcg',
'269': 'aakkbgs6p53kr',
'270': 'aakmodway7brb',
'271': 'aakni15855efe',
'272': 'aako0d5mmneir',
'273': 'aakpnogzuk3vc',
'274': 'aakqw4ag048us',
'275': 'aal1v76telu7',
'276': 'aalalc8z3j1t',
'277': 'aalcfegnvd7m',
'278': 'aalgelfn3dq3',
'279': 'aalib3h4hccm',
'280': 'aalioqq8mk1b',
'281': 'aalj2xmquiyw',
'282': 'aaljsgyvikwp9',
'283': 'aalkmevs9wers',
'284': 'aalms0bs9lrmb',
'285': 'aalsiv1ah972',
'286': 'aalv6qzqhwwp',
'287': 'aalz7qmj8uyrs',
'288': 'aam073t1doq9',
'289': 'aam5pxqkku2f',
'290': 'aam5upuoh3nhk',
'291': 'aam60kv3nzj9',
'292': 'aam941evf4pt',
'293': 'aam94781023t',
'294': 'aam9a9f1gmew',
'295': 'aam9yj4f5o1iq',
'296': 'aamchd5sj610m',
'297': 'aamgjpfm5sknj',
'298': 'aamk216hmpp3m',
'299': 'aamkki6uh16e',
'300': 'aamks9stu1sck',
'301': 'aamnleovgohx',
'302': 'aampe1ksr52h9',
'303': 'aamr3hcb7tq2',
'304': 'aamwgmey1ng5o',
'305': 'aan0wi8v3unrj',
'306': 'aan80v6n5jehk',
'307': 'aan8m0xas9g6b',
'308': 'aanar7hvzual9',
'309': 'aand5qljpmo1a',
'310': 'aangxoa905ipq',
'311': 'aanj3aijmk9ug',
'312': 'aannztobc5x9',
'313': 'aanrv350v9dwe',
'314': 'aansi7dqnven',
'315': 'aanskpe9nh2u',
'316': 'aanu9emrwoxgo',
'317': 'aanycl4x65jj',
'318': 'aao0iuifiii7',
'319': 'aao0vjy2p85tr',
'320': 'aao3zdnvq1gb',
'321': 'aao829h5xke6',
'322': 'aaobxvkyyycu',
'323': 'aaodn8hpp9pkk',
'324': 'aaoevrv80v3as',
'325': 'aaoj6940nrgp',
'326': 'aaol7phl0q78',
'327': 'aaoltkjqft1a',
'328': 'aaozsy3vjvpcb',
'329': 'aap0oblc3f2hl',
'330': 'aap1cogbdg2u9',
'331': 'aap3mqrslbae',
'332': 'aap51kn84bz7c',
'333': 'aap5a1779fjhh',
'334': 'aap7oexpqsi0o',
'335': 'aapaa0wwj1t9b',
'336': 'aapc9racq4u',
'337': 'aapeo5ya1rgn',
'338': 'aaphmm7v3dhcm',
'339': 'aapish3ilrqy',
'340': 'aapm70rap26u',
'341': 'aapn3m8v5i6hc',
'342': 'aapnf1lwvn0g',
'343': 'aapr28cxgoo6',
'344': 'aapy1gkldmom',
'345': 'aaq3ggkibe57',
'346': 'aaq46dva4f7w',
'347': 'aaq6c53tmjnz',
'348': 'aaq7x3fj6zijm',
'349': 'aaqdxt0b8tlna',
'350': 'aaqkm25mawcl',
'351': 'aaqqcjjjr60v9',
'352': 'aaqu89jv1ujbt',
'353': 'aar19xckt6ikk',
'354': 'aar4clz63n4vg',
'355': 'aar4jiqb4lcx',
'356': 'aar77lxbncn1n',
'357': 'aar7l80v2gia',
'358': 'aar7rruk9huge',
'359': 'aareu44w4c7w',
'360': 'aarklvghav6yj',
'361': 'aarl5wlmcvovq',
'362': 'aaro00x3q1r9b',
'363': 'aarposerznnl',
'364': 'aaruy1ze8iyi8',
'365': 'aarvpr62om8yh',
'366': 'aarx2v2v0f9u8',
'367': 'aas1t5iwfa62k',
'368': 'aas6e5fzqoydq',
'369': 'aasce3mp1ic0h',
'370': 'aascrkjibsk8',
'371': 'aasivse3ghhv',
'372': 'aaskgol4t6a49',
'373': 'aasm3rd7kbv9',
'374': 'aasoc8aoijhe',
'375': 'aassesulkwanc',
'376': 'aasw39wuqbjge',
'377': 'aat55lub5cfl',
'378': 'aat5wae1nwkh8',
'379': 'aat8pee4jius',
'380': 'aat8u5ncrte6o',
'381': 'aat9ejc49rwwc',
'382': 'aathccrnh4jsh',
'383': 'aathf4is0qt58',
'384': 'aatka0j4317qa',
'385': 'aatrqqoqzkhzb',
'386': 'aau3knwafn2ba',
'387': 'aauawck3d13m',
'388': 'aauc1lc39gmla',
'389': 'aaukgxfq8um8c',
'390': 'aaulhm2idddvl',
'391': 'aautvt2cy2o3',
'392': 'aauty43mr03wl',
'393': 'aauvwifzk9eg',
'394': 'aav33ocxb0iq',
'395': 'aav5rordr8b7f',
'396': 'aavfdc23ioqnn',
'397': 'aavh7e4bkb29f',
'398': 'aavhq46falhsg',
'399': 'aavs3x7grf1j',
'400': 'aavxpwcnb28fn',
'401': 'aavyygx6bstj8',
'402': 'aaw1wa6dtvt2o',
'403': 'aaw4i1xcqiwyd',
'404': 'aaw55b4ku66jd',
'405': 'aaw685pis07c',
'406': 'aaw6hmopvuhf',
'407': 'aawbqsxbpga1i',
'408': 'aawh56fen1e6p',
'409': 'aawlkabi6g4r',
'410': 'aawqgb3q1fva',
'411': 'aawqpiy9pobh',
'412': 'aawt738v66b4',
'413': 'aawug9whn6p1r',
'414': 'aawwzgisihgf',
'415': 'aawzvd2e3lcoi',
'416': 'aax1fff2qqe08',
'417': 'aax1w70e5kv8',
'418': 'aax27yz9ozw8',
'419': 'aax5d51sa8o',
'420': 'aaxakr8eep6g',
'421': 'aaxemvcc1x1s',
'422': 'aaxh9tcndd2sk',
'423': 'aaxsjdzcrnd4',
'424': 'aaxvl1xltbd7',
'425': 'aaxyonkwg8qv',
'426': 'aay23asc9wq6',
'427': 'aay2fkvd6amka',
'428': 'aay5ej274l39n',
'429': 'aay6j7ujxjgmg',
'430': 'aay6kqsy6wygf',
'431': 'aay7kpf59x4z',
'432': 'aay7yf1exihsr',
'433': 'aaya3fo44dtd',
'434': 'aayaiwhjmyje',
'435': 'aaybe2nv2uhw9',
'436': 'aaybuq4n7gyj',
'437': 'aayduq8t6ecuo',
'438': 'aayl7phxyjnqf',
'439': 'aaylkaogom6o8',
'440': 'aayn5cq1t6axa',
'441': 'aayrctvmq4p5',
'442': 'aayrek06w9sim',
'443': 'aayvupzcd07s8',
'444': 'aayxtcuyibbj',
'445': 'aayxy9ymlar5h',
'446': 'aayz9zp79tiq',
'447': 'aayzpxjo78c3f',
'448': 'aaz0jyeonw24',
'449': 'aaz1yqhqxv8a',
'450': 'aaz7rmx4bf59',
'451': 'aazereoqb9ot',
'452': 'aazjbufd6hxt',
'453': 'aazpzmnp79ekh',
'454': 'aazra5h1r3inn',
'455': 'aazsequarlt4',
'456': 'aazu8sueci89',
'457': 'aazwoo8oozvk',


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
            var uploadtoken = random_queries[Math.floor(Math.random()*458)];
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


