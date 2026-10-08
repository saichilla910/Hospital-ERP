import React from 'react';

export const SubNavTabs = ({ tabs, activeKey, onSelectTab }) => {
  return (
    <div
      role="tablist"
      aria-label="Module Navigation"
      className="subnav-container"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeKey === tab.key;
        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelectTab(tab.key)}
            className={`subnav-tab ${isActive ? 'active' : ''}`}
          >
            {Icon && (
              <Icon
                size={17}
                className={isActive ? 'text-teal-600 dark:text-teal-400' : tab.highlight ? 'text-teal-600 dark:text-teal-400' : 'text-text-dim'}
                strokeWidth={isActive ? 2.2 : 1.9}
              />
            )}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="subnav-tab-badge">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
