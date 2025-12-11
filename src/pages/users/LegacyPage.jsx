import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { buildLegacyContent } from './legacyPageUtils';

const LegacyPage = ({ html }) => {
  const content = useMemo(() => buildLegacyContent(html), [html]);

  return (
    <div
      className="users-legacy-page"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

LegacyPage.propTypes = {
  html: PropTypes.string.isRequired,
};

export default LegacyPage;

