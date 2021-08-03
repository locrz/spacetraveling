import { useEffect } from 'react';
import { uterancesConfig } from '../configs/uterances';

export const useUtterances = (commentNodeId: string): void => {
  useEffect(() => {
    const scriptParentNode = document.getElementById(commentNodeId);
    if (!scriptParentNode) return;

    const script = document.createElement('script');
    script.src = uterancesConfig.src;
    script.async = true;
    script.setAttribute('repo', uterancesConfig.repo);
    script.setAttribute('issue-term', uterancesConfig.issue_term);
    script.setAttribute('label', 'comment :speech_balloon:');
    script.setAttribute('theme', uterancesConfig.theme);
    script.setAttribute('crossorigin', uterancesConfig.crossorigin);

    scriptParentNode.appendChild(script);

    // eslint-disable-next-line consistent-return
    return () => {
      scriptParentNode.removeChild(scriptParentNode.firstChild);
    };
  }, [commentNodeId]);
};
