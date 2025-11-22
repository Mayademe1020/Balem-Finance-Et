import { useSlideStore } from '../store/slideStore';
import './SlideList.css';

export const SlideList = () => {
  const slides = useSlideStore((state) => state.slides);
  const currentSlideIndex = useSlideStore((state) => state.currentSlideIndex);
  const setCurrentSlide = useSlideStore((state) => state.setCurrentSlide);
  const addSlide = useSlideStore((state) => state.addSlide);
  const duplicateSlide = useSlideStore((state) => state.duplicateSlide);
  const deleteSlide = useSlideStore((state) => state.deleteSlide);

  return (
    <div className="slide-list">
      <div className="slide-list-header">
        <h2>Slides</h2>
        <button
          className="btn-add-slide"
          onClick={addSlide}
          title="Add New Slide"
          aria-label="Add New Slide"
          data-testid="add-slide"
        >
          + Add Slide
        </button>
      </div>

      <div className="slide-thumbnails">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide-thumbnail ${
              index === currentSlideIndex ? 'active' : ''
            }`}
            onClick={() => setCurrentSlide(index)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setCurrentSlide(index);
              }
            }}
            aria-label={`Slide ${index + 1}`}
            data-testid={`slide-thumbnail-${index}`}
          >
            <div className="slide-number">{index + 1}</div>
            <div className="slide-preview">
              {slide.thumbnail ? (
                <img
                  src={slide.thumbnail}
                  alt={`Slide ${index + 1} preview`}
                />
              ) : (
                <div className="slide-placeholder">
                  {slide.elements.length === 0 ? 'Empty' : `${slide.elements.length} items`}
                </div>
              )}
            </div>
            <div className="slide-actions">
              <button
                className="btn-small"
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateSlide(slide.id);
                }}
                title="Copy this slide"
                aria-label={`Duplicate slide ${index + 1}`}
              >
                Copy
              </button>
              {slides.length > 1 && (
                <button
                  className="btn-small btn-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Remove this slide?')) {
                      deleteSlide(slide.id);
                    }
                  }}
                  title="Remove this slide"
                  aria-label={`Delete slide ${index + 1}`}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="slide-count" data-testid="slide-count">
        {slides.length} of 5 slides
      </div>
    </div>
  );
};
