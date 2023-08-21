# Operational Security

Operational Security (OpSEC) is a systematic approach to cybersecurity and risk management. It involves a range of strategies to prevent unauthorized access and protect sensitive data from leaking.

While protecting cryptographic keys and passwords is essential, OpSEC does more than that. It looks at the bigger picture and considers such factors as physical security, personnel training, secure communication protocols, threat analysis, and risk mitigation.

Since Iroha 2 is used to process financial operations, OpSEC measures and practices must be taken seriously. Individuals and organizations utilizing Iroha 2 in their operations should consider iplementing OpSEC measures as part of their extensive security protocol.

## Recommended OpSEC Measures

- When interacting with others, maintain a cautious approach and stay vigilant, avoid sharing sensitive information without proper validation.

- Encrypt your disks. The boot device encryption allows data protection if an attacker gains access to your physical hardware. The same advice doubly applies to portable devices.

- Use trusted software. Software that ships via reproducible binary builds, and that you build from source, is the most trustworthy. Proprietary software or open source software that wasn't audited is a potential risk that must be taken seriously. 

- Verify the signatures on binary packages. This is not too different from the public key cryptography used inside Iroha v2. 

- To prevent unauthorized access, always secure your laptop or personal computer when leaving it unattended. Use strong passwords, lock the screen, and follow best practices for securing your devices.

- Don't leave portable devices unattended. A split second is enough to steal your device. 

- Enhance the security of your smartphone device by utilizing biometric access methods like fingerprints or facial recognition. Additionally, make sure to update your device's software whenever possible and regularly review and manage permissions granted to the installed applications.

- Establish a secure offline location for storing your private keys. This adds an extra layer of protection against digital threats by isolating the keys from the online network.

- Always keep your software updated to their latest version across all devices, including computers and phones. Regular updates help patch vulnerabilities and minimize potential risks associated with outdated software.

- Develop a routine for periodically updating passwords and software keys. This proactive approach significantly contributes to enhancing overall security posture.

## Using Browsers

If an application connected to Iroha 2 features a web UI, your browser can either aid the security or pose a potential threat. It is essential to exercise caution, especially when it comes to the plugins you choose to install.

Consider the following measures to enhance your browser's security:
- Avoid using browsers with known bad security models. Specifically
  * Chrome (proprietary)
  * Safari (proprietary, WebKit known to have fundamental security problems)
  * Opera (proprietary, known to leak data)
  * Firefox (known to leak data and pre-install questionable extensions)
  * Vivaldi (proprietary)
  * Edge (all of the above)
  * `surf` (extremely outdated)
- Prefer browsers with known good track records, and supporting user privacy and security first:
  * Librewolf, Icecat, Firedragon, _etc._.  -- Firefox forks with enhanced security features
  * Ungoogled chromium -- highly audited open source version of Chrome, 
  * Brave -- highly audited, adblock browser with privacy enhancing features
  * Falkon -- known good track record of security. All plugins come from the KDE store
  * Qutebrowser -- known good track record of security. The preferred browser of many security specialists. 
  
- Avoid enabling Java Script unless necessary. 

- Use the browser's built-in confinement mechanism for plugins. 

- Clear cookies before and after important operations. Avoid the "keep me signed in" style of buttons. 

- Enable ad-block features. These protect against more than just advertisements, and disable site tracking features. 

- Be mindful of lookalike characters (`0` and `O` and `О` are three different characters), make sure that you're able to spot them in a URL. 

- Avoid webmail in favour of clients. Set up your email client to sign and verify GPG key signatures. 

- Avoid using web-based messaging services. Be mindful that `electron` is itself a web browser meaning that e.g. Discord is susceptible to many of the same attacks as would a chromium window with the web version of Discord open. 
  - Update your browser to the latest version whenever possible. Updates often include critical security patches that address vulnerabilities.

  - Be cautious of what browser extenstions you install. Only use well-known and trusted extensions from reputable sources. Rogue extensions can compromise your data and privacy.

  - Create separate browser profiles for various tasks. Use one profile for everyday browsing and another for activities involving high security and sensitive data. This way, extensions installed on the profile for everyday browsing cannot access the sensitive data from the secure one.

  - Use a portable version of your browser copied to a USB flash drive. This method ensures that even if a security bug grants one of the installed plugins with access to data between the profiles, your security-related profile remains on a separate and removable device.

  - Periodically clear your browser's cache and cookies to remove potentially sensitive data that may accidentally be stored on your device.

## Recovery Plan

In the event of an emergency, such as losing a key or facing a security breach, a well-structured and prepared in advance recovery plan is an essential lifeline. Creating a clear set of steps to follow can help mitigate potential damage and promptly reinstate security.

Organizations should consider the following key aspects when developing their recovery plan:

  - Outline step-by-step procedures to be followed in case of key loss or other security incidents. Ensure that these steps are easily accessible and understandable by the users and/or employees.

  - Establish a communication channel that may be used to promptly report security breaches and potential threats, such as leaked or lost cryptographic keys and password.

  - If you utilize hardware keys (e.g., YubiKey or SoloKeys Solo) as a security measure, consider adopting redundancy strategy. Keep two keys: one for daily use and another stored in a secure location. This precaution ensures access even if the primary key is compromised or lost.

  - When security breaches or leaks are reported, react promptly by replacing or disabling affected keys and passwords. This proactive response minimizes the potential risks and damage.

  - Periodically review and update your recovery plan. This ensures that the plan remains relevant and effective as your security landscape evolves.

Remember that a recovery plan is not just another document. Rather, it's a lifeline that helps navigate unexpected challenges. By anticipating potential scenarios and establishing a clear roadmap for action, you fortify your operational security and enhance your readiness to respond effectively to any security incident.
