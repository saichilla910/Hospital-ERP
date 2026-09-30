import React, { useEffect } from 'react';
import { X, Info } from 'lucide-react';

const maxWidthMap = {
  'sm': 'max-w-sm',
  'md': 'max-w-md',
  'lg': 'max-w-lg',
  'xl': 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '450px': 'max-w-[450px]',
  '500px': 'max-w-[500px]',
  '550px': 'max-w-[550px]',
  '600px': 'max-w-[600px]',
  '650px': 'max-w-[650px]',
  '700px': 'max-w-[700px]',
  '750px': 'max-w-[750px]',
  '780px': 'max-w-[780px]',
  '800px': 'max-w-[800px]',
  '820px': 'max-w-[820px]',
  '840px': 'max-w-[840px]',
  '850px': 'max-w-[850px]',
  '880px': 'max-w-[880px]',
  '900px': 'max-w-[900px]',
  '920px': 'max-w-[920px]',
  '940px': 'max-w-[940px]',
  '950px': 'max-w-[950px]',
  '960px': 'max-w-[960px]',
  '980px': 'max-w-[980px]',
  '1000px': 'max-w-[1000px]',
  '1050px': 'max-w-[1050px]',
  '1100px': 'max-w-[1100px]',
  '1150px': 'max-w-[1150px]',
  '1200px': 'max-w-[1200px]'
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '650px',
  footer = null,
  headerIcon = null,
  headerRight = null,
  footerInfo = null
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWClass = maxWidthMap[maxWidth] || 'max-w-2xl';

  return (
    <div
      className="modal-overlay fixed inset-0 bg-slate-950/80 backdrop-blur-[14px] z-[1000] flex items-center justify-center p-3 sm:p-6 md:p-8 animate-[fadeIn_0.15s_ease]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`modal-frame w-full max-h-[90vh] bg-bg-surface border border-border-subtle rounded-2xl shadow-xl flex flex-col overflow-hidden animate-[slideUp_0.2s_cubic-bezier(0.16,1,0.3,1)] ${maxWClass}`}
      >
        {/* Modal Header */}
        <div className="modal-header px-5 sm:px-6 py-4 sm:py-4.5 border-b border-border-subtle flex items-center justify-between gap-4 bg-bg-surface-elevated shrink-0">
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            {headerIcon && (
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400 flex items-center justify-center shrink-0 border border-teal-200 dark:border-teal-800/60 shadow-2xs">
                {headerIcon}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-bold text-text-main leading-tight font-display tracking-tight truncate">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-text-muted mt-0.5 font-normal truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {headerRight && (
              <div className="hidden sm:flex flex-col items-end gap-0.5">
                {headerRight}
              </div>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-bg-surface flex items-center justify-center text-text-muted hover:text-text-main border border-border-subtle hover:border-border-strong hover:bg-bg-surface-hover transition-all cursor-pointer shrink-0 shadow-2xs"
              title="Close dialog (Esc)"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body px-5 sm:px-7 py-5 sm:py-6 overflow-y-auto flex-1">
          {children}
        </div>

        {/* Modal Footer */}
        {(footer || footerInfo) && (
          <div className="modal-footer px-5 sm:px-7 py-3.5 sm:py-4 border-t border-border-subtle bg-bg-surface-elevated/90 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="text-xs text-text-muted flex items-center gap-2 flex-1 min-w-[240px]">
              {footerInfo}
            </div>
            <div className="flex items-center gap-2.5 flex-wrap ml-auto">
              {footer}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
