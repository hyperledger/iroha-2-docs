import{_ as e,c as n,o as l,V as t,m as s,a}from"./chunks/framework.B6c1f-8R.js";const P=JSON.parse('{"title":"Password Security","description":"","frontmatter":{},"headers":[],"relativePath":"guide/security/password-security.md","filePath":"guide/security/password-security.md","lastUpdated":1727363525000}'),r={name:"guide/security/password-security.md"},i=t('<h1 id="password-security" tabindex="-1">Password Security <a class="header-anchor" href="#password-security" aria-label="Permalink to &quot;Password Security&quot;">​</a></h1><p>In the realm of blockchain security, protecting passwords is paramount. To ensure your data and everything it represents remain impervious to unauthorized access, let&#39;s delve into the nuances of password security.</p><h2 id="password-strength" tabindex="-1">Password Strength <a class="header-anchor" href="#password-strength" aria-label="Permalink to &quot;Password Strength&quot;">​</a></h2><p>Likely enough, you may have previously encountered recommendations on how to come up with a <em>strong</em> password. These may entail such advice as minimum password length, addition of special characters, etc. Such recommendations aim to increase the strength of your password that hinges on entropy, i.e. randomness of the password.</p><p>So, what defines a <em>strong password</em>? A strong password is a password with <em>high entropy</em>.</p><p>To calculate the entropy of a password, we may follow the <strong>Entropy formula</strong>:</p>',6),o=s("div",{class:"tip custom-block"},[s("p",{class:"custom-block-title"},"Entropy formula"),s("p",null,[s("span",{class:"katex"},[s("span",{class:"katex-mathml"},[s("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[s("semantics",null,[s("mrow",null,[s("mi",null,"L")]),s("annotation",{encoding:"application/x-tex"},"L")])])]),s("span",{class:"katex-html","aria-hidden":"true"},[s("span",{class:"base"},[s("span",{class:"strut",style:{height:"0.6833em"}}),s("span",{class:"mord mathnormal"},"L")])])]),a(" — Password length; number of symbols in the password."),s("br"),s("span",{class:"katex"},[s("span",{class:"katex-mathml"},[s("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[s("semantics",null,[s("mrow",null,[s("mi",null,"S")]),s("annotation",{encoding:"application/x-tex"},"S")])])]),s("span",{class:"katex-html","aria-hidden":"true"},[s("span",{class:"base"},[s("span",{class:"strut",style:{height:"0.6833em"}}),s("span",{class:"mord mathnormal",style:{"margin-right":"0.05764em"}},"S")])])]),a(" — Character set; size of the pool of unique possible symbols."),s("br"),s("span",{class:"katex"},[s("span",{class:"katex-mathml"},[s("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[s("semantics",null,[s("mrow",null,[s("msup",null,[s("mi",null,"S"),s("mi",null,"L")])]),s("annotation",{encoding:"application/x-tex"},"S^L")])])]),s("span",{class:"katex-html","aria-hidden":"true"},[s("span",{class:"base"},[s("span",{class:"strut",style:{height:"0.8413em"}}),s("span",{class:"mord"},[s("span",{class:"mord mathnormal",style:{"margin-right":"0.05764em"}},"S"),s("span",{class:"msupsub"},[s("span",{class:"vlist-t"},[s("span",{class:"vlist-r"},[s("span",{class:"vlist",style:{height:"0.8413em"}},[s("span",{style:{top:"-3.063em","margin-right":"0.05em"}},[s("span",{class:"pstrut",style:{height:"2.7em"}}),s("span",{class:"sizing reset-size6 size3 mtight"},[s("span",{class:"mord mathnormal mtight"},"L")])])])])])])])])])]),a(" — Number of possible combinations.")]),s("p",{class:"katex-block"},[s("span",{class:"katex-display"},[s("span",{class:"katex"},[s("span",{class:"katex-mathml"},[s("math",{xmlns:"http://www.w3.org/1998/Math/MathML",display:"block"},[s("semantics",null,[s("mrow",null,[s("mi",null,"E"),s("mi",null,"n"),s("mi",null,"t"),s("mi",null,"r"),s("mi",null,"o"),s("mi",null,"p"),s("mi",null,"y"),s("mo",null,"="),s("mi",null,"l"),s("mi",null,"o"),s("msub",null,[s("mi",null,"g"),s("mn",null,"2")]),s("mo",{stretchy:"false"},"("),s("msup",null,[s("mi",null,"S"),s("mi",null,"L")]),s("mo",{stretchy:"false"},")")]),s("annotation",{encoding:"application/x-tex"}," Entropy=log_2(S^L) ")])])]),s("span",{class:"katex-html","aria-hidden":"true"},[s("span",{class:"base"},[s("span",{class:"strut",style:{height:"0.8778em","vertical-align":"-0.1944em"}}),s("span",{class:"mord mathnormal",style:{"margin-right":"0.05764em"}},"E"),s("span",{class:"mord mathnormal"},"n"),s("span",{class:"mord mathnormal"},"t"),s("span",{class:"mord mathnormal"},"ro"),s("span",{class:"mord mathnormal"},"p"),s("span",{class:"mord mathnormal",style:{"margin-right":"0.03588em"}},"y"),s("span",{class:"mspace",style:{"margin-right":"0.2778em"}}),s("span",{class:"mrel"},"="),s("span",{class:"mspace",style:{"margin-right":"0.2778em"}})]),s("span",{class:"base"},[s("span",{class:"strut",style:{height:"1.1413em","vertical-align":"-0.25em"}}),s("span",{class:"mord mathnormal",style:{"margin-right":"0.01968em"}},"l"),s("span",{class:"mord mathnormal"},"o"),s("span",{class:"mord"},[s("span",{class:"mord mathnormal",style:{"margin-right":"0.03588em"}},"g"),s("span",{class:"msupsub"},[s("span",{class:"vlist-t vlist-t2"},[s("span",{class:"vlist-r"},[s("span",{class:"vlist",style:{height:"0.3011em"}},[s("span",{style:{top:"-2.55em","margin-left":"-0.0359em","margin-right":"0.05em"}},[s("span",{class:"pstrut",style:{height:"2.7em"}}),s("span",{class:"sizing reset-size6 size3 mtight"},[s("span",{class:"mord mtight"},"2")])])]),s("span",{class:"vlist-s"},"​")]),s("span",{class:"vlist-r"},[s("span",{class:"vlist",style:{height:"0.15em"}},[s("span")])])])])]),s("span",{class:"mopen"},"("),s("span",{class:"mord"},[s("span",{class:"mord mathnormal",style:{"margin-right":"0.05764em"}},"S"),s("span",{class:"msupsub"},[s("span",{class:"vlist-t"},[s("span",{class:"vlist-r"},[s("span",{class:"vlist",style:{height:"0.8913em"}},[s("span",{style:{top:"-3.113em","margin-right":"0.05em"}},[s("span",{class:"pstrut",style:{height:"2.7em"}}),s("span",{class:"sizing reset-size6 size3 mtight"},[s("span",{class:"mord mathnormal mtight"},"L")])])])])])])]),s("span",{class:"mclose"},")")])])])])]),s("p",null,"The resulting number is the amount of entropy bits in a password. The higher the number, the harder the password is to crack."),s("p",null,"Knowing the entropy value, the amount of attempts required to brute-force a password with said entropy can be derived by using the following formula:"),s("p",{class:"katex-block"},[s("span",{class:"katex-display"},[s("span",{class:"katex"},[s("span",{class:"katex-mathml"},[s("math",{xmlns:"http://www.w3.org/1998/Math/MathML",display:"block"},[s("semantics",null,[s("mrow",null,[s("msup",null,[s("mi",null,"S"),s("mi",null,"L")]),s("mo",null,"="),s("msup",null,[s("mn",null,"2"),s("mi",null,"E")]),s("mi",null,"n"),s("mi",null,"t"),s("mi",null,"r"),s("mi",null,"o"),s("mi",null,"p"),s("mi",null,"y")]),s("annotation",{encoding:"application/x-tex"}," S^L=2^Entropy ")])])]),s("span",{class:"katex-html","aria-hidden":"true"},[s("span",{class:"base"},[s("span",{class:"strut",style:{height:"0.8913em"}}),s("span",{class:"mord"},[s("span",{class:"mord mathnormal",style:{"margin-right":"0.05764em"}},"S"),s("span",{class:"msupsub"},[s("span",{class:"vlist-t"},[s("span",{class:"vlist-r"},[s("span",{class:"vlist",style:{height:"0.8913em"}},[s("span",{style:{top:"-3.113em","margin-right":"0.05em"}},[s("span",{class:"pstrut",style:{height:"2.7em"}}),s("span",{class:"sizing reset-size6 size3 mtight"},[s("span",{class:"mord mathnormal mtight"},"L")])])])])])])]),s("span",{class:"mspace",style:{"margin-right":"0.2778em"}}),s("span",{class:"mrel"},"="),s("span",{class:"mspace",style:{"margin-right":"0.2778em"}})]),s("span",{class:"base"},[s("span",{class:"strut",style:{height:"1.0858em","vertical-align":"-0.1944em"}}),s("span",{class:"mord"},[s("span",{class:"mord"},"2"),s("span",{class:"msupsub"},[s("span",{class:"vlist-t"},[s("span",{class:"vlist-r"},[s("span",{class:"vlist",style:{height:"0.8913em"}},[s("span",{style:{top:"-3.113em","margin-right":"0.05em"}},[s("span",{class:"pstrut",style:{height:"2.7em"}}),s("span",{class:"sizing reset-size6 size3 mtight"},[s("span",{class:"mord mathnormal mtight",style:{"margin-right":"0.05764em"}},"E")])])])])])])]),s("span",{class:"mord mathnormal"},"n"),s("span",{class:"mord mathnormal"},"t"),s("span",{class:"mord mathnormal"},"ro"),s("span",{class:"mord mathnormal"},"p"),s("span",{class:"mord mathnormal",style:{"margin-right":"0.03588em"}},"y")])])])])]),s("p",null,[a("There is no universal answer as to how high the entropy of a password should be. For financial organizations, it is advised to keep the entropy of their passwords in the range from "),s("code",null,"64"),a(" to "),s("code",null,"127"),a(" bits ("),s("code",null,"128"),a(" bits or more is generally considered to be an overkill). However, keep in mind that "),s("abbr",{title:"Graphics Processing Unit"},"GPU"),a("s keep constantly evolving, and the time required for password cracking keeps decreasing over time.")])],-1),m=s("p",null,"Following the entropy formula, let us compare the following two examples:",-1),p=s("ol",null,[s("li",null,[a("A 16-character password with the character set utilizing only lowercase letters of the modern English alphabet (26 characters) yields approximately 43 sextillion ("),s("span",{class:"katex"},[s("span",{class:"katex-mathml"},[s("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[s("semantics",null,[s("mrow",null,[s("mn",null,"43"),s("mo",null,"∗"),s("mn",null,"1"),s("msup",null,[s("mn",null,"0"),s("mn",null,"2")]),s("mn",null,"1")]),s("annotation",{encoding:"application/x-tex"},"43*10^21")])])]),s("span",{class:"katex-html","aria-hidden":"true"},[s("span",{class:"base"},[s("span",{class:"strut",style:{height:"0.6444em"}}),s("span",{class:"mord"},"43"),s("span",{class:"mspace",style:{"margin-right":"0.2222em"}}),s("span",{class:"mbin"},"∗"),s("span",{class:"mspace",style:{"margin-right":"0.2222em"}})]),s("span",{class:"base"},[s("span",{class:"strut",style:{height:"0.8141em"}}),s("span",{class:"mord"},"1"),s("span",{class:"mord"},[s("span",{class:"mord"},"0"),s("span",{class:"msupsub"},[s("span",{class:"vlist-t"},[s("span",{class:"vlist-r"},[s("span",{class:"vlist",style:{height:"0.8141em"}},[s("span",{style:{top:"-3.063em","margin-right":"0.05em"}},[s("span",{class:"pstrut",style:{height:"2.7em"}}),s("span",{class:"sizing reset-size6 size3 mtight"},[s("span",{class:"mord mtight"},"2")])])])])])])]),s("span",{class:"mord"},"1")])])]),a(") possible combinations.")])],-1),c=s("pre",null,[s("code",null,`$$Entropy=log_2(26^{16})=log_2(43,608,742,899,428,874,059,776)=75.20703...$$
`)],-1),h=s("ol",{start:"2"},[s("li",null,[a("A 16-character password with the character set expanded to 96, including uppercase letters and special symbols, inflates the number of possible combinations to a staggering 52 nonillion ("),s("span",{class:"katex"},[s("span",{class:"katex-mathml"},[s("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[s("semantics",null,[s("mrow",null,[s("mn",null,"52"),s("mo",null,"∗"),s("mn",null,"1"),s("msup",null,[s("mn",null,"0"),s("mn",null,"3")]),s("mn",null,"0")]),s("annotation",{encoding:"application/x-tex"},"52*10^30")])])]),s("span",{class:"katex-html","aria-hidden":"true"},[s("span",{class:"base"},[s("span",{class:"strut",style:{height:"0.6444em"}}),s("span",{class:"mord"},"52"),s("span",{class:"mspace",style:{"margin-right":"0.2222em"}}),s("span",{class:"mbin"},"∗"),s("span",{class:"mspace",style:{"margin-right":"0.2222em"}})]),s("span",{class:"base"},[s("span",{class:"strut",style:{height:"0.8141em"}}),s("span",{class:"mord"},"1"),s("span",{class:"mord"},[s("span",{class:"mord"},"0"),s("span",{class:"msupsub"},[s("span",{class:"vlist-t"},[s("span",{class:"vlist-r"},[s("span",{class:"vlist",style:{height:"0.8141em"}},[s("span",{style:{top:"-3.063em","margin-right":"0.05em"}},[s("span",{class:"pstrut",style:{height:"2.7em"}}),s("span",{class:"sizing reset-size6 size3 mtight"},[s("span",{class:"mord mtight"},"3")])])])])])])]),s("span",{class:"mord"},"0")])])]),a("), improving entropy significantly.")])],-1),u=s("pre",null,[s("code",null,`$$Entropy=log_2(96^{16})=log_2(52,040,292,466,647,269,602,037,015,248,896)=105.35940... $$
`)],-1),d=s("p",null,[a("As can be seen, even by only expanding the character set from 26 to 96 symbols, the number of possible combinations that a malicious party would need to bruteforce has expanded by "),s("span",{class:"katex"},[s("span",{class:"katex-mathml"},[s("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[s("semantics",null,[s("mrow",null,[s("mn",null,"1.1933"),s("mo",null,"∗"),s("mn",null,"1"),s("msup",null,[s("mn",null,"0"),s("mn",null,"9")])]),s("annotation",{encoding:"application/x-tex"},"1.1933*10^9")])])]),s("span",{class:"katex-html","aria-hidden":"true"},[s("span",{class:"base"},[s("span",{class:"strut",style:{height:"0.6444em"}}),s("span",{class:"mord"},"1.1933"),s("span",{class:"mspace",style:{"margin-right":"0.2222em"}}),s("span",{class:"mbin"},"∗"),s("span",{class:"mspace",style:{"margin-right":"0.2222em"}})]),s("span",{class:"base"},[s("span",{class:"strut",style:{height:"0.8141em"}}),s("span",{class:"mord"},"1"),s("span",{class:"mord"},[s("span",{class:"mord"},"0"),s("span",{class:"msupsub"},[s("span",{class:"vlist-t"},[s("span",{class:"vlist-r"},[s("span",{class:"vlist",style:{height:"0.8141em"}},[s("span",{style:{top:"-3.063em","margin-right":"0.05em"}},[s("span",{class:"pstrut",style:{height:"2.7em"}}),s("span",{class:"sizing reset-size6 size3 mtight"},[s("span",{class:"mord mtight"},"9")])])])])])])])])])]),a(" times.")],-1),g=t('<p>Additionally increasing the length of the password, will grow the number of possible combinations even further, therefore enhancing the entropy—strength—of the password.</p><p>However, instead of wrestling with complexities, we advise using a password manager program—like <a href="https://keepassxc.org/" target="_blank" rel="noreferrer">KeePassXC</a> (for more details, see <em><a href="./storing-cryptographic-keys.html#adding-a-password-manager-program">Adding a Password Manager Program</a></em> and <em><a href="./storing-cryptographic-keys.html#configuring-keepassxc">Configuring KeePassXC</a></em>)—to generate and securely store your passwords.</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>Certain websites limit the maximum possible entropy of passwords, i.e., either limit the maximum password length or the set of accepted characters, or both.</p><p>Keep this in mind when using such websites and aim to periodically update your passwords.</p></div><h2 id="password-vulnerabilities" tabindex="-1">Password Vulnerabilities <a class="header-anchor" href="#password-vulnerabilities" aria-label="Permalink to &quot;Password Vulnerabilities&quot;">​</a></h2><p>Passwords can fall victim to brute-force attacks, typically executed using powerful GPUs in conjunction with dictionaries or exhaustive iteration through all possibilities. To thwart such attempts, craft a unique password devoid of personal information like birthdays, addresses, phone numbers, or social security numbers. Avoid providing attackers with easily guessable clues.</p><p>So, how hard it is to crack a modern password? It really depends on who you ask.</p><p>With a setup like <a href="https://en.wikipedia.org/wiki/Kevin_Mitnick" target="_blank" rel="noreferrer">Kevin Mitnick</a>&#39;s <a href="https://twitter.com/kevinmitnick/status/1649421434899275778?s=20" target="_blank" rel="noreferrer">cluster setup</a> housing 24 NVIDIA® GeForce RTX 4090&#39;s and 6 NVIDIA® GeForce RTX 2080&#39;s, all of them running <a href="https://github.com/hashtopolis" target="_blank" rel="noreferrer">Hashtopolis</a> software, he used to crack passwords that supposed to take a year in mere half a month.</p><p>However, let&#39;s now compare it to a single RTX 4090, capable of processing through 300 <abbr title="Hashes per second">H/s</abbr> using <a href="https://www.tarlogic.com/cybersecurity-glossary/ntlm-hash" target="_blank" rel="noreferrer"><code>NTLM</code></a> and 200 <abbr title="Hashes per second">H/s</abbr> using <a href="https://en.wikipedia.org/wiki/Bcrypt" target="_blank" rel="noreferrer"><code>bcrypt</code></a>, as outlined in <a href="https://twitter.com/Chick3nman512/status/1580712040179826688" target="_blank" rel="noreferrer">this tweet</a>.</p><p>As an extension of our previous entropy calculations, let&#39;s now examine the following projected cracking times:</p>',9),y=s("ol",null,[s("li",null,[s("p",null,[a("There are "),s("span",{class:"katex"},[s("span",{class:"katex-mathml"},[s("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[s("semantics",null,[s("mrow",null,[s("mn",null,"31"),s("mo",{separator:"true"},","),s("mn",null,"540"),s("mo",{separator:"true"},","),s("mn",null,"000")]),s("annotation",{encoding:"application/x-tex"},"31,540,000")])])]),s("span",{class:"katex-html","aria-hidden":"true"},[s("span",{class:"base"},[s("span",{class:"strut",style:{height:"0.8389em","vertical-align":"-0.1944em"}}),s("span",{class:"mord"},"31"),s("span",{class:"mpunct"},","),s("span",{class:"mspace",style:{"margin-right":"0.1667em"}}),s("span",{class:"mord"},"540"),s("span",{class:"mpunct"},","),s("span",{class:"mspace",style:{"margin-right":"0.1667em"}}),s("span",{class:"mord"},"000")])])]),a(" seconds in a regular non-leap year. Assuming the worst-case scenario with "),s("code",null,"NTLM"),a(", at the speed of "),s("span",{class:"katex"},[s("span",{class:"katex-mathml"},[s("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[s("semantics",null,[s("mrow",null,[s("mn",null,"300"),s("mo",null,"∗"),s("mn",null,"1"),s("msup",null,[s("mn",null,"0"),s("mn",null,"9")])]),s("annotation",{encoding:"application/x-tex"},"300*10^9")])])]),s("span",{class:"katex-html","aria-hidden":"true"},[s("span",{class:"base"},[s("span",{class:"strut",style:{height:"0.6444em"}}),s("span",{class:"mord"},"300"),s("span",{class:"mspace",style:{"margin-right":"0.2222em"}}),s("span",{class:"mbin"},"∗"),s("span",{class:"mspace",style:{"margin-right":"0.2222em"}})]),s("span",{class:"base"},[s("span",{class:"strut",style:{height:"0.8141em"}}),s("span",{class:"mord"},"1"),s("span",{class:"mord"},[s("span",{class:"mord"},"0"),s("span",{class:"msupsub"},[s("span",{class:"vlist-t"},[s("span",{class:"vlist-r"},[s("span",{class:"vlist",style:{height:"0.8141em"}},[s("span",{style:{top:"-3.063em","margin-right":"0.05em"}},[s("span",{class:"pstrut",style:{height:"2.7em"}}),s("span",{class:"sizing reset-size6 size3 mtight"},[s("span",{class:"mord mtight"},"9")])])])])])])])])])]),a(),s("abbr",{title:"Hashes per second"},"H/s"),a(", it would take a single RTX 4090 approximately "),s("span",{class:"katex"},[s("span",{class:"katex-mathml"},[s("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[s("semantics",null,[s("mrow",null,[s("mn",null,"4"),s("mo",{separator:"true"},","),s("mn",null,"608.83")]),s("annotation",{encoding:"application/x-tex"},"4,608.83")])])]),s("span",{class:"katex-html","aria-hidden":"true"},[s("span",{class:"base"},[s("span",{class:"strut",style:{height:"0.8389em","vertical-align":"-0.1944em"}}),s("span",{class:"mord"},"4"),s("span",{class:"mpunct"},","),s("span",{class:"mspace",style:{"margin-right":"0.1667em"}}),s("span",{class:"mord"},"608.83")])])]),a(" years to crack a 16-character password with a character set of 26 letters of the modern English alphabet.")])]),s("li",null,[s("p",null,[a("If instead of "),s("code",null,"NTLM"),a(" we use "),s("code",null,"bcrypt"),a(", therefore reducing the iteration speed to "),s("span",{class:"katex"},[s("span",{class:"katex-mathml"},[s("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[s("semantics",null,[s("mrow",null,[s("mn",null,"200"),s("mo",null,"∗"),s("mn",null,"1"),s("msup",null,[s("mn",null,"0"),s("mn",null,"3")])]),s("annotation",{encoding:"application/x-tex"},"200*10^3")])])]),s("span",{class:"katex-html","aria-hidden":"true"},[s("span",{class:"base"},[s("span",{class:"strut",style:{height:"0.6444em"}}),s("span",{class:"mord"},"200"),s("span",{class:"mspace",style:{"margin-right":"0.2222em"}}),s("span",{class:"mbin"},"∗"),s("span",{class:"mspace",style:{"margin-right":"0.2222em"}})]),s("span",{class:"base"},[s("span",{class:"strut",style:{height:"0.8141em"}}),s("span",{class:"mord"},"1"),s("span",{class:"mord"},[s("span",{class:"mord"},"0"),s("span",{class:"msupsub"},[s("span",{class:"vlist-t"},[s("span",{class:"vlist-r"},[s("span",{class:"vlist",style:{height:"0.8141em"}},[s("span",{style:{top:"-3.063em","margin-right":"0.05em"}},[s("span",{class:"pstrut",style:{height:"2.7em"}}),s("span",{class:"sizing reset-size6 size3 mtight"},[s("span",{class:"mord mtight"},"3")])])])])])])])])])]),a(),s("abbr",{title:"Hashes per second"},"H/s"),a(", while also expanding the character set to 96, including uppercase letters and special symbols, the time to crack soars to about "),s("span",{class:"katex"},[s("span",{class:"katex-mathml"},[s("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[s("semantics",null,[s("mrow",null,[s("mn",null,"8"),s("mo",{separator:"true"},","),s("mn",null,"249"),s("mo",{separator:"true"},","),s("mn",null,"887"),s("mo",{separator:"true"},","),s("mn",null,"835"),s("mo",{separator:"true"},","),s("mn",null,"549"),s("mo",{separator:"true"},","),s("mn",null,"662"),s("mo",{separator:"true"},","),s("mn",null,"270.456")]),s("annotation",{encoding:"application/x-tex"},"8,249,887,835,549,662,270.456")])])]),s("span",{class:"katex-html","aria-hidden":"true"},[s("span",{class:"base"},[s("span",{class:"strut",style:{height:"0.8389em","vertical-align":"-0.1944em"}}),s("span",{class:"mord"},"8"),s("span",{class:"mpunct"},","),s("span",{class:"mspace",style:{"margin-right":"0.1667em"}}),s("span",{class:"mord"},"249"),s("span",{class:"mpunct"},","),s("span",{class:"mspace",style:{"margin-right":"0.1667em"}}),s("span",{class:"mord"},"887"),s("span",{class:"mpunct"},","),s("span",{class:"mspace",style:{"margin-right":"0.1667em"}}),s("span",{class:"mord"},"835"),s("span",{class:"mpunct"},","),s("span",{class:"mspace",style:{"margin-right":"0.1667em"}}),s("span",{class:"mord"},"549"),s("span",{class:"mpunct"},","),s("span",{class:"mspace",style:{"margin-right":"0.1667em"}}),s("span",{class:"mord"},"662"),s("span",{class:"mpunct"},","),s("span",{class:"mspace",style:{"margin-right":"0.1667em"}}),s("span",{class:"mord"},"270.456")])])]),a(" years, far surpassing the age of the universe.")])])],-1),w=s("p",null,[a("So, simply picking higher entropy raised the time it takes to crack a password to unfathomable numbers. Yes, the process may be sped up by using multiple GPUs, however this method pales in comparison with the "),s("a",{href:"https://xkcd.com/538/",target:"_blank",rel:"noreferrer"},"XKCD approach"),a(".")],-1),b=s("p",null,[a("It is important to note that an extensive character set isn't always necessary to reach high entropy. It can be obtained by using multi-word passwords, or lengthy sentences in particular. The classic "),s("a",{href:"https://xkcd.com/936/",target:"_blank",rel:"noreferrer"},"XKCD comic"),a(" illustrates this concept eloquently.")],-1),x=s("div",{class:"warning custom-block"},[s("p",{class:"custom-block-title"},"WARNING"),s("p",null,"Avoid writing your password down anywhere. Store your password recovery phrase securely. If the phrase is too long, you may write it down, ensuring that you can read it out and type it out later. Store the physical copy of the phrase in a secure location and/or container.")],-1),k=[i,o,m,p,c,h,u,d,g,y,w,b,x];function f(v,_,M,z,S,T){return l(),n("div",null,k)}const A=e(r,[["render",f]]);export{P as __pageData,A as default};